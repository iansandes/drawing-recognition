from keras.models import load_model
from keras import backend as K
import numpy as np
import cv2


class CNN:
    def __init__(self, model, labels) -> None:
        self.labels = labels
        self.model = load_model(
            model,
            custom_objects={
                "recall_m": self.recall_m,
                "precision_m": self.precision_m,
                "f1_m": self.f1_m,
            },
        )

    def predict(self, image):
        img_to_pred = cv2.resize(image, (28, 28))
        img_ready = img_to_pred.reshape(1, 28, 28, 1).astype("float32") / 255
        prediction = self.model.predict(img_ready)
        exact_prediction = np.argmax(prediction, axis=1)
        return self.labels[int(exact_prediction)]

    def recall_m(y_true, y_pred):
        true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
        possible_positives = K.sum(K.round(K.clip(y_true, 0, 1)))
        recall = true_positives / (possible_positives + K.epsilon())
        return recall

    def precision_m(y_true, y_pred):
        true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
        predicted_positives = K.sum(K.round(K.clip(y_pred, 0, 1)))
        precision = true_positives / (predicted_positives + K.epsilon())
        return precision

    def f1_m(y_true, y_pred):
        precision = precision_m(y_true, y_pred)
        recall = recall_m(y_true, y_pred)
        return 2 * ((precision * recall) / (precision + recall + K.epsilon()))
