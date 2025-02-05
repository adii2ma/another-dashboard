import FileUpload from "../../components/fileupload"

export default function UploadPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0D1B2A] to-[#1B263B] overflow-hidden">
      <main className="flex-1 flex items-center justify-center">
        <FileUpload />
      </main>
    </div>
  )
}

