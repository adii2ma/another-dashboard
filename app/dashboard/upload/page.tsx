import FileUpload from "../../components/fileupload"
import Sidebar from "../../components/sidebar"

export default function UploadPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#005f63] to-[#005f63] overflow-hidden">
 
      <main className="flex-1 flex items-center justify-center">
        <FileUpload />
      </main>
    </div>
  )
}

