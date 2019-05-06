import React from 'react';
import { View, Text, ScrollView  } from 'react-native';
import { Header,ListItem } from 'react-native-elements'
// import shoppingList from "../../data/shopping-list"
import recipeDb from "../../data/recipe"
// import console = require('console');

class IngredientScreen extends React.Component {
  constructor(props){
    super(props);

    // title is retrieved from Meal List Screen
    this.state={
      ingredients:[],
      title:this.props.navigation.state.params.mealName
      
    }
  }
  render() {
    this.state.ingredients=(this.createIngredientsList([this.state.title]));
      return (
        <View style={{flex: 1}}>
            <Header
            placement="left"
            leftComponent={{ icon: 'menu', color: '#fff' }}
            centerComponent={{ text: this.state.title, style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff' }}
            />
        
            <ScrollView >
                {
                    this.state.ingredients.map((item,i) => (
                    <ListItem
                        key={i}
                        title={item}
                    />
                    ))
                }
            </ScrollView>
        </View>
      );
    }

    createIngredientsList(mealName) {
      let ingredientsList = [];
        for (let recipeIndex = 0; recipeIndex < recipeDb.length; recipeIndex++) {
          if (recipeDb[recipeIndex].name == mealName) {
            let tempname = "Ingredients for " + mealName;
            ingredientsList.push(tempname);
            for (ingredientIndex = 0; ingredientIndex < recipeDb[recipeIndex].ingredients.length; ingredientIndex++) {
              let temp = "";
                if (recipeDb[recipeIndex].ingredients[ingredientIndex].measurement == "") {
                  temp += recipeDb[recipeIndex].ingredients[ingredientIndex].name;
                } else {
                  temp += recipeDb[recipeIndex].ingredients[ingredientIndex].name + recipeDb[recipeIndex].ingredients[ingredientIndex].amount + " " + recipeDb[recipeIndex].ingredients[ingredientIndex].measurement;
                }
                ingredientsList.push(temp);
          }
          ingredientsList.push("");
          break;
        }
      
    }
    ingredientsList.pop()
    return ingredientsList;
   }
  }
  export default IngredientScreen;