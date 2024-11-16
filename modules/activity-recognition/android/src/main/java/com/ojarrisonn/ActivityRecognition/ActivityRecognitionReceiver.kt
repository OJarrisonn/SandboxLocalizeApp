package com.ojarrisonn.ActivityRecognition

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.google.android.gms.location.ActivityRecognitionResult

class ActivityRecognitionReceiver(
    private val emitActivityUpdate: (body: Map<String, Any?>) -> Unit
) : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (ActivityRecognitionResult.hasResult(intent)) {
            val result = ActivityRecognitionResult.extractResult(intent)
            val detectedActivities = result?.probableActivities

            detectedActivities?.forEach {
                emitActivityUpdate(it.toMap())
            }
        }
    }
}