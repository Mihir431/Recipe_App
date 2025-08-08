import { useClerk, useUser } from '@clerk/clerk-expo'
import { useState } from 'react';
import { View, Text, Alert, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import { API_URL } from '../../constants/api';
import { useEffect } from 'react';
import { favoritesStyles } from '../../assets/styles/favorites.styles';
import LoadingSpinner from '../../components/LoadingSpinner';
import RecipeCard from '../../components/RecipeCard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import NoFavoritesFound from '../../components/NoFavoritesFound';

const FavoritesScreen = () => {

    const {signOut} = useClerk();
    const {user} = useUser()

    const [favoriteRecipes, setFavoriteRecipes]= useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const loadFavorites = async()=>{
        try {
            const response = await fetch(`${API_URL}/favorites/${user.id}`)
            if(!response.ok) throw new Error("Failed to fetchfavorites")
                const favorites = await response.json()
            const transformedFavorites = favorites.map(favorite=>({
                ...favorite,
                id: favorite.recipeId
            }))

            setFavoriteRecipes(transformedFavorites)
            
        } catch (error) {
            console.log("Error loading favorites", error);
            
            Alert.alert("Error", "Failed to load favorites")
        }
        finally{
            setLoading(false)
        }
      }
    
     loadFavorites()
    }, [user.id])

    const handleSignOut = async () => {
         Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
    }
    
 if (loading) return <LoadingSpinner message="Loading your favorites..." />;

  return (
    <View style ={favoritesStyles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
     <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity style={favoritesStyles.logoutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

         <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favoriteRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={<NoFavoritesFound />}
          />
        </View>


        </ScrollView>
    
    </View>
  )
}

export default FavoritesScreen