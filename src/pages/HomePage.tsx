import Chat from "../components/Chat.tsx";
import NoChatSelected from "../components/NoChatSelected.tsx";
import Sidebar from "../components/Sidebar.tsx";
import { useChatStore } from "../store/useChatStore.ts"

const HomePage = () => {
  const {setSelectedUser} = useChatStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar/>

            {setSelectedUser ? <Chat/> : <NoChatSelected/> }
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage