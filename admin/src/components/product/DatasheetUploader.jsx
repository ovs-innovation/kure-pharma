import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiFileText, FiTrash2, FiUploadCloud } from "react-icons/fi";

import {
  getAdminCloudinaryConfig,
  getCloudinaryErrorMessage,
  uploadPdfToCloudinary,
  validatePdfFile,
} from "@/utils/cloudinaryUpload";
import { notifyError, notifySuccess } from "@/utils/toast";

const DatasheetUploader = ({ datasheetUrl, setDatasheetUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles?.[0];
      if (!file) return;

      const validationError = validatePdfFile(file);
      if (validationError) {
        notifyError(validationError);
        return;
      }

      const config = getAdminCloudinaryConfig();
      if (!config.valid) {
        notifyError(config.error);
        return;
      }

      setUploading(true);
      setProgress(0);

      try {
        const url = await uploadPdfToCloudinary({
          file,
          folder: "product-datasheets",
          config,
          onProgress: setProgress,
        });
        setDatasheetUrl(url);
        notifySuccess("Datasheet uploaded successfully.");
      } catch (error) {
        notifyError(getCloudinaryErrorMessage(error));
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [setDatasheetUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="space-y-3">
      {datasheetUrl ? (
        <div className="flex items-center justify-between gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
          <a
            href={datasheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-green-700 font-medium truncate"
          >
            <FiFileText className="shrink-0" />
            <span className="truncate">View uploaded datasheet</span>
          </a>
          <button
            type="button"
            onClick={() => setDatasheetUrl("")}
            className="text-red-500 hover:text-red-700 p-1"
            title="Remove datasheet"
          >
            <FiTrash2 />
          </button>
        </div>
      ) : null}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        <FiUploadCloud className="mx-auto text-2xl text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {uploading
            ? `Uploading… ${progress}%`
            : "Drop PDF datasheet here, or click to browse"}
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF only, max 10 MB</p>
      </div>
    </div>
  );
};

export default DatasheetUploader;
