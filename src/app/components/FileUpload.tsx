"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void,
    onProgress?: (progress: number) => void,
    fileType?: "image" | "video"
}


export default function FileUpload({
    onSuccess, onProgress, fileType = "image"
}: FileUploadProps) {

    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onError = (err: { message: string }) => {
        console.log("Error", err);
        setError(err.message)
        setUploading(false)
    };

    const handleSuccess = (res: IKUploadResponse) => {
        console.log("Success", res);
        setUploading(false)
        setError(null)
        onSuccess(res)
    };

    const handleProgress = (evt: ProgressEvent) => {
        if (evt.lengthComputable && onProgress) {
            const percentCompletion = (evt.loaded / evt.total) * 100
            onProgress(Math.round(percentCompletion))
        }
    };

    const handleStartUpload = () => {
        setUploading(true)
        setError(null)
    };

    const validateFile = (file: File) => {
        if (fileType == "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a video")
                return false
            }
        } else {
            const validTypes = ["image/jpeg", "image/png"]
            if (!validTypes.includes(file.type)) {
                setError("Image type is invalid (JPEG, PNG)")
                return false
            }
        }
        return true
    }

    return (
        <div>
            <IKUpload
                fileName="test-upload.jpg"
                useUniqueFileName={true}
                responseFields={["tags"]}
                validateFile={validateFile}

                folder={fileType === "video" ? "/videos" : "/images"}
                onError={onError}
                onSuccess={handleSuccess}
                onUploadProgress={handleProgress}
                onUploadStart={handleStartUpload}
            />
            {
                uploading && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Uploading...</span>
                    </div>
                )
            }
            {
                error && (
                    <div className="text-error text-sm">
                        {error}
                    </div>
                )
            }
        </div>
    );
}