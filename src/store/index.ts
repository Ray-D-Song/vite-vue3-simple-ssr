import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
	state: () => ({
		firstName: 'Ray',
		lastName: 'Song',
	}),
	getters: {
		getFullName: state => (`${state.firstName}-D-${state.lastName}`),
	},
	actions: {
		updateUserName(newFirstName: string, newLastName: string) {
			this.firstName = newFirstName
			this.lastName = newLastName
		},
	},
})

export default useUserStore
