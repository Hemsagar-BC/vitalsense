from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np

_MODEL = None
_LABEL_ENCODER = None


def _load_assets() -> tuple[object, object]:
    global _MODEL, _LABEL_ENCODER
    if _MODEL is not None and _LABEL_ENCODER is not None:
        return _MODEL, _LABEL_ENCODER

    models_dir = Path(__file__).resolve().parent / "models"
    model_path = models_dir / "vital_model.pkl"
    encoder_path = models_dir / "label_encoder.pkl"

    try:
        _MODEL = joblib.load(model_path)
        _LABEL_ENCODER = joblib.load(encoder_path)
    except FileNotFoundError as exc:
        missing_path = Path(exc.filename or "")
        raise FileNotFoundError(
            f"Model asset not found: {missing_path}. "
            "Ensure vital_model.pkl and label_encoder.pkl exist in backend/models/."
        ) from exc

    return _MODEL, _LABEL_ENCODER


def predict(heart_rate: float, spo2: float, temperature: float) -> str:
    model, label_encoder = _load_assets()
    features = np.array([[heart_rate, spo2, temperature]], dtype=float)
    prediction = model.predict(features)
    label = label_encoder.inverse_transform(prediction)[0]
    label_str = str(label).strip().lower()

    if label_str not in {"normal", "warning", "critical"}:
        raise ValueError(
            "Unexpected prediction label. Expected one of: normal, warning, critical."
        )

    return label_str
