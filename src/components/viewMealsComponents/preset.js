import React from 'react';
import { View, ScrollView  } from 'react-native';
import { Header,ListItem } from 'react-native-elements';
import recipeData from '../../data/recipe';

class PresetScreen extends React.Component {
    render() {
      return (
        <View>
            <Header
            placement="left"
            leftComponent={{ icon: 'menu', color: '#fff' }}
            centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff' }}
            />
        
            <ScrollView >
                {
                    recipeData.map((l, i) => (
                    <ListItem
                        key={i}
                        title={l.name}
                        onPress={this.handleMealSend.bind(this,l.name)}
                    />
                    ))
                }
            </ScrollView>
        </View>
      );
    }

    handleMealSend(name){
        const { navigate } = this.props.navigation;
        // Send name of the meal to the Ingredients Screen Component (ingredients.js)
        navigate('Ingredients', { mealName: name })

        return;
    }



  }
  export default PresetScreen;