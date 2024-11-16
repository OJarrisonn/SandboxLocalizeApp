package com.ojarrisonn.ActivityRecognition

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.util.Log
import expo.modules.interfaces.permissions.Permissions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.lang.ref.WeakReference

class ActivityRecognitionModule : Module() {
    companion object {
        const val ON_ACTIVITY_UPDATE = "onActivityUpdate"
        const val ACTIVITY_UPDATE_INTENT = "com.ojarrisonn.ActivityRecognition.ACTIVITY_UPDATE"
    }

    private lateinit var context: Context
    private lateinit var receiver: ActivityRecognitionReceiver

    override fun definition() = ModuleDefinition {
        Name("ActivityRecognition")

        OnCreate {
            context = appContext.reactContext!!

            registerReceiver()
        }

        OnDestroy { unregisterReceiver() }

        Events(ON_ACTIVITY_UPDATE)

        AsyncFunction("requestPermissionsAsync") { promise: Promise ->
            Permissions.askForPermissionsWithPermissionsManager(
                appContext.permissions,
                promise,
                Manifest.permission.ACTIVITY_RECOGNITION,
                Manifest.permission.FOREGROUND_SERVICE,
                Manifest.permission.ACCESS_BACKGROUND_LOCATION,
                Manifest.permission.ACCESS_FINE_LOCATION,
                "com.google.android.gms.permission.ACTIVITY_RECOGNITION"
            )
        }

        AsyncFunction("startTracking") { promise: Promise ->
            val intent = Intent(appContext.reactContext, ActivityRecognitionService::class.java)
            appContext.reactContext?.startService(intent)
            Log.d("ActivityRecognition", "Service started")
            promise.resolve(null)
        }

        AsyncFunction("stopTracking") { promise: Promise ->
            val intent = Intent(appContext.reactContext, ActivityRecognitionService::class.java)
            appContext.reactContext?.stopService(intent)
            Log.d("ActivityRecognition", "Service stopped")
            promise.resolve(null)
        }
    }

    @SuppressLint("NewApi")
    private fun registerReceiver() {
        receiver = ActivityRecognitionReceiver { body ->
            Log.d("ActivityRecognition", "Received activity update: $body")
            sendEvent(ON_ACTIVITY_UPDATE, body)
        }
        context.registerReceiver(receiver,
            IntentFilter(ACTIVITY_UPDATE_INTENT),
            Context.RECEIVER_NOT_EXPORTED)
    }

    private fun unregisterReceiver() {
        context.unregisterReceiver(receiver)
    }
}
