from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd

_MODEL = None
_SCALER = None
_LABEL_ENCODER = None

_NORMAL_BPM_MIN = 60.0
_NORMAL_BPM_MAX = 100.0
_BPM_DEVIATION_BASELINE = 75.0


def _load_assets() -> tuple[object, object, object]:
    global _MODEL, _SCALER, _LABEL_ENCODER
    if _MODEL is not None and _SCALER is not None and _LABEL_ENCODER is not None:
        return _MODEL, _SCALER, _LABEL_ENCODER

    models_dir = Path(__file__).resolve().parent / "models"
    model_path = models_dir / "heart_rate_model.pkl"
    scaler_path = models_dir / "heart_rate_scaler.pkl"
    encoder_path = models_dir / "heart_rate_labels.pkl"

    try:
        _MODEL = joblib.load(model_path)
        _SCALER = joblib.load(scaler_path)
        _LABEL_ENCODER = joblib.load(encoder_path)
    except FileNotFoundError as exc:
        missing_path = Path(exc.filename or "")
        raise FileNotFoundError(
            f"Model asset not found: {missing_path}. "
            "Ensure heart_rate_model.pkl, heart_rate_scaler.pkl, and "
            "heart_rate_labels.pkl exist in backend/models/."
        ) from exc

    return _MODEL, _SCALER, _LABEL_ENCODER


def _build_features(heart_rate: float) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "Heart Rate (bpm)": heart_rate,
                "bpm_deviation": abs(heart_rate - _BPM_DEVIATION_BASELINE),
                "is_bradycardia": float(heart_rate < _NORMAL_BPM_MIN),
                "is_normal_range": float(
                    _NORMAL_BPM_MIN <= heart_rate <= _NORMAL_BPM_MAX
                ),
                "is_tachycardia": float(heart_rate > _NORMAL_BPM_MAX),
                "bpm_squared": heart_rate**2,
            }
        ]
    )


def predict(heart_rate: float) -> str:
    model, scaler, label_encoder = _load_assets()
    features = scaler.transform(_build_features(heart_rate))
    prediction = model.predict(features)
    label = label_encoder.inverse_transform(prediction)[0]
    label_str = str(label).strip().lower()

    if label_str not in {"normal", "abnormal"}:
        raise ValueError(
            "Unexpected prediction label. Expected one of: normal, abnormal."
        )

    return label_str
