from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_session import Session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import numpy as np
import tensorflow as tf
from PIL import Image
import mysql.connector
from mysql.connector import Error
import pandas as pd
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  
app.config['SESSION_TYPE'] = 'filesystem'  
Session(app) 
CORS(app)  

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'signin'  

# Load the model
try:
    model = tf.keras.models.load_model('models/my_model.h5')
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

# class names 
class_names = [
    "Acne and Rosacea",
    "Actinic Keratosis",
    "Atopic Dermatitis",
    "Cellulitis",
    "Eczema",
    "Exanthems",
    "Herpes",
    "Light Diseases",
    "Lupus",
    "Melanoma",
    "Poison Ivy",
    "Psoriasis",
    "Seborrheic Keratosis",
    "Systemic Disease",
    "Tinea",
    "Urticaria",
    "Vascular Tumors",
    "Vasculitis",
    "Warts"
]
load_dotenv()
# MySQL connection function
def create_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        print("Database connected successfully!")
        return connection
    except Error as e:
        print(f"Error: {e}")
        return None

# User model for Flask-Login
class User(UserMixin):
    def __init__(self, id, name, email):
        self.id = id
        self.name = name
        self.email = email

# Load user from the user ID stored in the session
@login_manager.user_loader
def load_user(user_id):
    connection = create_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()
        if user:
            return User(user['id'], user['name'], user['email'])
    return None

# Route for the home page
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Skin Disease Prediction API!"})

# Route for sign-up
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    connection = create_connection()
    if connection:
        cursor = connection.cursor()
        try:
            cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, password))
            connection.commit()
            return jsonify({"message": "User created successfully!"}), 201
        except Error as e:
            print(f"Database error: {e}")
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            connection.close()
    return jsonify({"error": "Database connection error."}), 500

# Route for sign-in
@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    connection = create_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
            user = cursor.fetchone()

            if user:
                user_obj = User(user['id'], user['name'], user['email'])
                login_user(user_obj)  
                print("User logged in successfully!")
                return jsonify({"message": "Login successful!", "user": user}), 200
            else:
                print("Invalid email or password.")
                return jsonify({"error": "Invalid email or password."}), 401
        except Error as e:
            print(f"Database error: {e}")
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            connection.close()
    return jsonify({"error": "Database connection error."}), 500

# Route for logging out
@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()  
    return jsonify({"message": "Logout successful!"}), 200

# Route for predicting the disease
@app.route('/predict', methods=['POST'])
@login_required  
def predict():
    if 'file' not in request.files:
        print("No file part in request.")
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        print("No selected file.")
        return jsonify({"error": "No selected file"}), 400

    user_id = current_user.id  
    try:
        # Load and preprocess the image
        image = Image.open(file.stream)
        processed_image = preprocess_image(image)
        print(f"Image processed: {processed_image.shape}")

        # Make predictions
        predictions = model.predict(processed_image)
        print(f"Predictions: {predictions}")

        predicted_class = class_names[np.argmax(predictions)]
        print(f"Predicted class: {predicted_class}")

        # Insert diagnosis into the database
        insert_diagnosis(user_id, predicted_class)

        return jsonify({"predicted_class": predicted_class})

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": str(e)}), 500

# Function to preprocess the image
def preprocess_image(image):
    image = image.resize((224, 224))  
    image = np.array(image) / 255.0  
    print(f"Image shape before adding batch dimension: {image.shape}")
    return np.expand_dims(image, axis=0)  

# Function to insert diagnosis into the database
def insert_diagnosis(user_id, predicted_class):
    connection = create_connection()
    if connection:
        cursor = connection.cursor()
        try:
            cursor.execute("SELECT id FROM diseases WHERE disease_name = %s", (predicted_class,))
            result = cursor.fetchone()

            if result:
                disease_id = result[0]
                cursor.execute("INSERT INTO diagnoses (user_id, disease_id, disease_name) VALUES (%s, %s, %s)", 
                               (int(user_id), disease_id, predicted_class))
                connection.commit()
                print("Diagnosis inserted successfully!")
            else:
                print("Predicted disease not found in the database.")
        except Error as e:
            print(f"Database error: {e}")
        finally:
            cursor.close()
            connection.close()

@app.route('/previous_diagnoses', methods=['GET'])
@login_required
def previous_diagnoses():
    user_id = current_user.id  
    connection = create_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM diagnoses WHERE user_id = %s", (user_id,))
            diagnoses = cursor.fetchall()
            return jsonify(diagnoses), 200
        except Error as e:
            print(f"Database error: {e}")
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            connection.close()

    return jsonify({"error": "Database connection error."}), 500

@app.route('/disease_info', methods=['GET'])
def get_disease_info():
    disease_name = request.args.get('disease_name')
    
    if not disease_name:
        return jsonify({"error": "Disease name is required"}), 400

    connection = create_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Query for disease details and treatment options based on the disease name
            cursor.execute("SELECT disease_name, disease_details, treatment_options FROM diseases WHERE disease_name = %s", (disease_name,))
            disease_info = cursor.fetchone()
            
            if disease_info:
                return jsonify(disease_info), 200
            else:
                return jsonify({"error": "Disease not found"}), 404
        except Error as e:
            print(f"Database error: {e}")
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            connection.close()
    
    return jsonify({"error": "Database connection error."}), 500


COSMETICS_CSV = 'C:/Monesha/Projects/SKINSIGHT/backend/Skincare/cosmetics.csv'

@app.route('/skincare/products', methods=['GET'])
def get_products():
    skin_type = request.args.get('skinType')
    
    # Load the CSV
    df = pd.read_csv(COSMETICS_CSV)
    
    
    if skin_type == "Dry":
        filtered_products = df[df['Dry'] == 1]
    elif skin_type == "Oily":
        filtered_products = df[df['Oily'] == 1]
    elif skin_type == "Sensitive":
        filtered_products = df[df['Sensitive'] == 1]
    elif skin_type == "Combination":
        filtered_products = df[df['Combination'] == 1]
    else:
        return jsonify([])  
    sorted_products = filtered_products.sort_values(by='Rank', ascending=True).head(15)
   
    products = sorted_products[['Name', 'Brand', 'Ingredients','Rank']].to_dict(orient='records')  # Removed AM/PM Routine
    
    return jsonify(products)

@app.route('/create_routine', methods=['POST'])
@login_required
def create_routine():
    data = request.get_json()
    user_id = current_user.id
    routine_type = data.get('routine_type')  
    products = data.get('products') 

    connection = create_connection()
    if connection:
        cursor = connection.cursor()
        try:
            
            cursor.execute(
                "DELETE FROM routines WHERE user_id = %s AND routine_type = %s",
                (user_id, routine_type)
            )
            
            for product in products:
                cursor.execute(
                    "INSERT INTO routines (user_id, routine_type, product_name) VALUES (%s, %s, %s)",
                    (user_id, routine_type, product)
                )
            
            connection.commit()
            return jsonify({"message": "Routine created successfully!"}), 201

        except Error as e:
            print(f"Database error: {e}")
            return jsonify({"error": str(e)}), 400

        finally:
            cursor.close()
            connection.close()
    
    return jsonify({"error": "Database connection error."}), 500

@app.route('/get_routine', methods=['GET'])
@login_required
def get_routine():
    user_id = current_user.id
    connection = create_connection()
    if connection:
        cursor = connection.cursor()
        try:
            cursor.execute(
                "SELECT * FROM routines WHERE user_id = %s",
                (user_id,)
            )
            routines = cursor.fetchall()

            routine_list = []
            for routine in routines:
                routine_dict = {
                    'id': routine[0],
                    'user_id': routine[1],
                    'routine_type': routine[2],
                    'products': routine[3] 
                }
                routine_list.append(routine_dict)

            return jsonify(routine_list), 200
        except Error as e:
            print(f"Database error: {e}")
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            connection.close()

    return jsonify({"error": "Database connection error."}), 500

@app.route('/save_progress', methods=['POST'])
@login_required
def save_progress():
    data = request.get_json()
    user_id = current_user.id
    time_of_day = data.get('time_of_day')
    product_name = data.get('product_name')
    completed = data.get('completed')  # true or false

    connection = create_connection()
    if connection:
        cursor = connection.cursor()
        try:
            # Here you might want to check if there's an existing record for today and the user
            cursor.execute("""
                INSERT INTO progress (user_id, date, time_of_day, completed, total)
                VALUES (%s, %s, %s, %s, 1)
                ON DUPLICATE KEY UPDATE completed = %s
            """, (user_id, datetime.now().strftime('%Y-%m-%d'), time_of_day, completed, completed))
            connection.commit()
            return jsonify({"message": "Progress saved successfully!"}), 201
        except Error as e:
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            connection.close()
    return jsonify({"error": "Database connection error."}), 500

# Route for getting weekly progress
@app.route('/get_weekly_progress', methods=['GET'])
@login_required
def get_weekly_progress():
    user_id = current_user.id  
    start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    connection = create_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            # Fetch the progress records for the past week
            cursor.execute(
                "SELECT * FROM progress WHERE user_id = %s AND date >= %s",
                (user_id, start_date)
            )
            progress = cursor.fetchall()
            return jsonify(progress), 200
        except Error as e:
            print(f"Database error: {e}")
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            connection.close()

    return jsonify({"error": "Database connection error."}), 500


# Route for saving quiz results
@app.route('/save_quiz_results', methods=['POST'])
@login_required 
def save_quiz_results():
    data = request.get_json()
    user_id = current_user.id  
    skin_type = data.get('skinType')
    skin_concern = data.get('skinConcern')

    connection = create_connection()
    if connection:
        cursor = connection.cursor()
        try:
            cursor.execute(
                "INSERT INTO quiz_results (user_id, skin_type, skin_concern, quiz_date) VALUES (%s, %s, %s, NOW())",
                (user_id, skin_type, skin_concern)
            )
            connection.commit()
            print("Quiz results saved successfully!")
            return jsonify({"message": "Quiz results saved successfully!"}), 201
        except Error as e:
            print(f"Database error: {e}")
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            connection.close()
    return jsonify({"error": "Database connection error."}), 500

# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
