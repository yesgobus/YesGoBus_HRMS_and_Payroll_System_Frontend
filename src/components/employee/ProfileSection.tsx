import { useState } from "react"
import { Upload } from "lucide-react"

function ProfileSection() {

  const [image, setImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center w-full">

      {/* Profile Image */}
      <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden mb-5 border-4 border-gray-100 shadow">

        {image ? (
          <img
            src={image}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

      </div>

      {/* Upload */}
      <label className="flex items-center gap-2 text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-700 transition">

        <Upload size={18} />
        Upload Photo

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

      </label>

    </div>
  )
}

export default ProfileSection