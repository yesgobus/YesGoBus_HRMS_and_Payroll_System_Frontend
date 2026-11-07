import { useState } from "react"
import { Upload, FileText, Trash2 } from "lucide-react"

interface FileItem {
  name: string
  url: string
}

function FilesTab() {

  const [files, setFiles] = useState<FileItem[]>([])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files

    if (!selectedFiles) return

    const newFiles = Array.from(selectedFiles).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleDelete = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
  }

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-lg font-semibold text-gray-800">
          Documents & Files
        </h2>

        {/* Upload */}
        <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-700 transition">

          <Upload size={16} />
          Upload File

          <input
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
          />

        </label>

      </div>

      {/* File List */}
      <div className="space-y-3">

        {files.length === 0 && (
          <p className="text-sm text-gray-500">
            No files uploaded yet
          </p>
        )}

        {files.map((file, index) => (

          <div
            key={index}
            className="flex items-center justify-between bg-white border rounded-lg px-4 py-3 shadow-sm"
          >

            {/* File Info */}
            <div className="flex items-center gap-3">

              <FileText className="text-gray-500" size={18} />

              <div>
                <p className="text-sm font-medium text-gray-800">
                  {file.name}
                </p>
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">

              <a
                href={file.url}
                target="_blank"
                className="text-blue-600 text-sm hover:underline"
              >
                View
              </a>

              <button
                onClick={() => handleDelete(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default FilesTab