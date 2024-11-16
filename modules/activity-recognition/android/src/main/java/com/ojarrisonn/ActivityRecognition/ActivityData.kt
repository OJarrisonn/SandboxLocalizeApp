package com.ojarrisonn.ActivityRecognition

import com.google.android.gms.location.DetectedActivity


fun DetectedActivity.toMap(): Map<String, Any?> {
    val type = when (this.type) {
        DetectedActivity.IN_VEHICLE -> "EM_VEICULO"
        DetectedActivity.ON_BICYCLE -> "NA_BICICLETA"
        DetectedActivity.ON_FOOT -> "A_PE"
        DetectedActivity.RUNNING -> "CORRENDO"
        DetectedActivity.STILL -> "PARADO"
        DetectedActivity.WALKING -> "CAMINHANDO"
        else -> "DESCONHECIDO"
    }

    return mapOf(
        "type" to type,
        "confidence" to this.confidence
    )
}