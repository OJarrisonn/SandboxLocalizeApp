package com.ojarrisonn.ActivityRecognition

import android.Manifest
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.content.pm.PackageManager
import android.os.IBinder
import android.util.Log
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.ActivityRecognition
import com.google.android.gms.location.ActivityRecognitionClient
import com.google.android.gms.tasks.Task
import java.util.concurrent.TimeUnit

class ActivityRecognitionService : Service() {
    private lateinit var activityRecognitionClient: ActivityRecognitionClient

    override fun onCreate() {
        super.onCreate()
        activityRecognitionClient = ActivityRecognition.getClient(this)
        requestActivityUpdates()
    }

    private fun requestActivityUpdates() {
        val task: Task<Void> = if (
            ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACTIVITY_RECOGNITION
            ) != PackageManager.PERMISSION_GRANTED) {
            return
        } else {
            activityRecognitionClient.requestActivityUpdates(
            TimeUnit.SECONDS.toMillis(5),
            getPendingIntent())
        }

        task.addOnSuccessListener {
            // Successfully requested activity updates
            Log.d("ActivityRecognition", "Activity updates requested")
        }
        task.addOnFailureListener {
            // Failed to request activity updates
            Log.e("ActivityRecognition", "Failed to request activity updates")
        }
    }

    private fun getPendingIntent(): PendingIntent {
        val intent = Intent(this, ActivityRecognitionReceiver::class.java)
        return PendingIntent.getBroadcast(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT)
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}