import os
import cv2
import pickle
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.decomposition import PCA

def load_images_from_folder(folder, img_size=(128, 128), sample_size=5000):
    images = []
    labels = []

    # Check if the folder exists
    if not os.path.isdir(folder):
        raise ValueError(f"Folder {folder} does not exist.")
    
    label_dirs = [d for d in os.listdir(folder) if os.path.isdir(os.path.join(folder, d))]
    print(f"Found labels: {label_dirs}")

    for label_dir in label_dirs:
        label_path = os.path.join(folder, label_dir)
        image_files = os.listdir(label_path)
        for i, img_name in enumerate(image_files):
            if len(images) >= sample_size:
                break  # Limit the total number of images
            img_path = os.path.join(label_path, img_name)
            img = cv2.imread(img_path)
            if img is None:
                print(f"Warning: Unable to load image {img_path}")
                continue

            # Resize image
            img = cv2.resize(img, img_size)

            # Bilateral Filtering
            img = cv2.bilateralFilter(img, d=9, sigmaColor=75, sigmaSpace=75)

            # Histogram Equalization
            img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            img_eq = cv2.equalizeHist(img_gray)

            # Convert back to BGR
            img_eq = cv2.cvtColor(img_eq, cv2.COLOR_GRAY2BGR)

            images.append(img_eq)
            labels.append(label_dir)
            if len(images) >= sample_size:
                break  # Stop processing if the limit is reached

    return np.array(images), np.array(labels)

def preprocess_and_classify(train_images, train_labels, test_images, test_labels):
    # Reshape images to (num_samples, num_features)
    train_images_reshaped = train_images.reshape(train_images.shape[0], -1)
    test_images_reshaped = test_images.reshape(test_images.shape[0], -1)
    print(f"Train images reshaped to: {train_images_reshaped.shape}")
    print(f"Test images reshaped to: {test_images_reshaped.shape}")

    # Apply PCA for dimensionality reduction
    print("Starting PCA...")
    pca = PCA(n_components=0.95)  # Keep 95% of the variance
    train_images_pca = pca.fit_transform(train_images_reshaped)
    test_images_pca = pca.transform(test_images_reshaped)
    print(f"PCA completed. Train shape: {train_images_pca.shape}, Test shape: {test_images_pca.shape}")

    # Encode labels
    print("Encoding labels...")
    le = LabelEncoder()
    train_labels_encoded = le.fit_transform(train_labels)
    test_labels_encoded = le.transform(test_labels)
    print(f"Labels encoded.")

    # Standardize features
    print("Standardizing features...")
    scaler = StandardScaler()
    train_images_flat = scaler.fit_transform(train_images_pca)
    test_images_flat = scaler.transform(test_images_pca)
    print(f"Features standardized.")

    # Initialize and train KNN classifier
    print("Initializing K-Nearest Neighbors classifier...")
    knn = KNeighborsClassifier(n_neighbors=5)  # You can tune the number of neighbors
    print("Training KNN model...")
    knn.fit(train_images_flat, train_labels_encoded)
    print("KNN model training completed.")

    # Predict on the test set
    y_pred_knn = knn.predict(test_images_flat)
    print("Prediction on test set using KNN completed.")

    # Evaluate the KNN model
    accuracy_knn = accuracy_score(test_labels_encoded, y_pred_knn)
    print(f"KNN Test Accuracy: {accuracy_knn:.4f}")
    print(classification_report(test_labels_encoded, y_pred_knn, target_names=le.classes_))

    # Save the KNN model
    with open('models/knn_model.pkl', 'wb') as model_file:
        pickle.dump(knn, model_file)
    print("KNN model saved.")

    # Save the StandardScaler
    with open('models/scaler.pkl', 'wb') as scaler_file:
        pickle.dump(scaler, scaler_file)
    print("Scaler saved.")

    # Save the LabelEncoder
    with open('models/le.pkl', 'wb') as le_file:
        pickle.dump(le, le_file)
    print("LabelEncoder saved.")

    # Save the PCA model
    with open('models/pca.pkl', 'wb') as pca_file:
        pickle.dump(pca, pca_file)
    print("PCA saved.")

if __name__ == "__main__":
    train_dir = "newdata/Dataset/train"  # Path to your training dataset directory
    test_dir = "newdata/Dataset/test"    # Path to your testing dataset directory
    
    train_images, train_labels = load_images_from_folder(train_dir, sample_size=5000)
    test_images, test_labels = load_images_from_folder(test_dir, sample_size=5000)
    
    preprocess_and_classify(train_images, train_labels, test_images, test_labels)
