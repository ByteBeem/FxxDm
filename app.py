from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Load the model and prepare data once when the Flask app starts
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, TensorBoard
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import datetime
import numpy as np

# Load the test data
test_data = pd.read_csv("test.csv")
test_data['Datetime'] = pd.to_datetime(test_data['Datetime'])

# Define input features (assuming the same features as in your training data)
features = ['Open', 'High', 'Low', 'Adj Close', 'Volume']

# Extract the input features from the test data
X_test = test_data[features].values

# Load the trained LSTM model
model = load_model('best_eur_model.h5')
print("Loaded the saved model.")

X_test = X_test.reshape(X_test.shape[0], 1, X_test.shape[1])

# Predict the next movement
predicted_close_prices = model.predict(X_test)

# Create a new scaler for the single column of predicted close prices
scaler = MinMaxScaler()
predicted_close_prices = scaler.fit_transform(predicted_close_prices)

# Inverse transform the predictions to get actual close prices
predicted_close_prices = scaler.inverse_transform(predicted_close_prices)

# Determine whether to buy or sell based on the predicted close prices
latest_predicted_price = predicted_close_prices[-1][0]  # Get the latest predicted price
previous_close_price = test_data['Close'].iloc[-1]  # Assuming 'Close' is the column for actual close prices

if latest_predicted_price > previous_close_price:
    default_signal = "Buy"
else:
    default_signal = "Sell"

@app.route('/')
def serve_html():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Use the default_signal computed during startup
        signal = default_signal

        # If the prediction is successful, return a custom success response code (200 OK)
        response_data = {
            "message": "Prediction successful",
            "signal": signal
        }

        return jsonify(response_data), 200  # 200 OK for success
        

    except Exception as e:
        # If an exception occurs, return a 401 (Unauthorized) response
        return jsonify({"error": str(e)}), 401

if __name__ == '__main__':
    app.run(debug=True)
