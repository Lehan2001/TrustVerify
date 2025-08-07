from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the model once at startup
model_path = "shoe_model.keras"
model = tf.keras.models.load_model(model_path)

class_names = ['Fake', 'Real']

print("🔁 /predict called")
print("FILES:", request.files)


@app.route('/predict', methods=['POST'])
def predict():
    files = request.files.getlist('images')
    print(f"Received {len(files)} files.")

    if not files:
        return jsonify({'error': 'No images uploaded'}), 400

    predictions = []
    for img_file in files:
        print(f"Processing: {img_file.filename}")
        try:
            img_path = os.path.join("temp", img_file.filename)
            os.makedirs("temp", exist_ok=True)
            img_file.save(img_path)

            img = image.load_img(img_path, target_size=(224, 224))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0) / 255.0

            pred = model.predict(img_array)[0]
            predictions.append(pred)

            print(f"Predicted: {pred}")

        except Exception as e:
            print(f"Error processing {img_file.filename}: {e}")

        finally:
            if os.path.exists(img_path):
                os.remove(img_path)

    if not predictions:
        return jsonify({'error': 'No valid images processed'}), 400

    avg_prediction = np.mean(predictions, axis=0)
    predicted_class = class_names[np.argmax(avg_prediction)]
    confidence = float(np.max(avg_prediction)) * 100

    return jsonify({
        'prediction': predicted_class,
        'confidence': round(confidence, 2),
        'total_images': len(predictions)
    })

