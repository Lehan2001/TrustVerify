from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import requests
from bs4 import BeautifulSoup
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load trained model once
model_path = "shoe_model.keras"
model = tf.keras.models.load_model(model_path)
class_names = ['Fake', 'Real']

# Load Adidas prices from JSON
with open("prices.json") as f:
    price_data = json.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    print("🔁 /predict called")
    print("Form data:", request.form)
    print("Files:", request.files)

    brand = request.form.get('brand', '').strip()
    model_name = request.form.get('model', '').strip()

    if not brand or not model_name:
        return jsonify({'error': 'Brand and model name are required'}), 400

    files = request.files.getlist('images')
    if not files or all(f.filename == '' for f in files):
        return jsonify({'error': 'No images uploaded'}), 400

    predictions = []
    os.makedirs("temp", exist_ok=True)

    for img_file in files:
        try:
            img_path = os.path.join("temp", img_file.filename)
            img_file.save(img_path)

            img = image.load_img(img_path, target_size=(224, 224))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)

            pred = model.predict(img_array, verbose=0)[0]
            predictions.append(pred)

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

    price = get_price(brand, model_name)

    return jsonify({
        'prediction': predicted_class,
        'confidence': round(confidence, 2),
        'total_images': len(predictions),
        'brand': brand,
        'model': model_name,
        'price': price
    })


def get_price(brand, model_name):
    price = "Not Found"
    try:
        if brand.lower() == "nike":
            # Nike: scrape live
            search_query = model_name.replace(" ", "+")
            url = f"https://www.nike.com/w?q={search_query}&vst={search_query}"
            headers = {"User-Agent": "Mozilla/5.0"}
            response = requests.get(url, headers=headers)
            soup = BeautifulSoup(response.text, 'html.parser')

            price_tag = soup.find("div", {"data-test": "product-price"})
            if not price_tag:
                price_tag = soup.find("div", class_="product-price")
            if not price_tag:
                price_tag = soup.find("span", class_="product-price")
            if price_tag:
                price = price_tag.get_text(strip=True)

        elif brand.lower() == "adidas":
            key = model_name.strip().lower()
            adidas_prices = {k.lower(): v for k, v in price_data.get("adidas", {}).items()}
            price = adidas_prices.get(key, "Not Found")


    except Exception as e:
        print(f"Price fetching error: {e}")

    return price


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
