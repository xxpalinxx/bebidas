import { StateCreator } from 'zustand'
import { Recipe } from '../types'
import { createNotificationSlice, NotificationSliceType } from './notificationSlice'
import { createRecipesSlice, RecipesSliceType } from './recipeSlice'

export type FavoritesSliceType = {
    favorites: Recipe[]
    handleClickFavorite: (recipe: Recipe) => void
    favoriteExists: (id: Recipe['idDrink']) => boolean
    loadFromStorage: () => void
}

export const createFavoritesSlice : StateCreator<FavoritesSliceType & RecipesSliceType & NotificationSliceType, [], [], FavoritesSliceType> = (set,get,api) => ({
    favorites: [],
    handleClickFavorite: (recipe) => {
        if(get().favoriteExists(recipe.idDrink)){
            set((state) => ({
                favorites: state.favorites.filter(fav => fav.idDrink!==recipe.idDrink)
            }))
            createNotificationSlice(set,get,api).showNotificacion({
                text: 'Se eliminó de favoritos',
                error: false
            })
        } else {
            set((state) => ({
                favorites: [...state.favorites, recipe]
            }))
            createNotificationSlice(set,get,api).showNotificacion({
                text: 'Se agregó a favoritos',
                error: false
            })
        }
        createRecipesSlice(set,get,api).closeModal()
        localStorage.setItem('favorites', JSON.stringify(get().favorites))
    },
    favoriteExists: (id) => {
        return get().favorites.some(favorite=>favorite.idDrink===id)
    },
    loadFromStorage: () => {
        const storedFavorites = localStorage.getItem('favorites')
        if(storedFavorites) {
            set({
                favorites: JSON.parse(storedFavorites)
            })
        }
    }
})