import { defineComponent } from 'vue'
import useUserStore from '@/store/index'

export default defineComponent(() => {
  const userStore = useUserStore()

  function handleUpdateUserName (): void {
    userStore.updateUserName('Jenny', 'Hu')
  }

  return () => (
    <div>
      <div>{ userStore.getFullName }</div>
      <button onClick={handleUpdateUserName}>updateUserName</button>
    </div>
  )
})
