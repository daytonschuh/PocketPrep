import React from 'react';
import { View, Text, ScrollView  } from 'react-native';
import { Header,ListItem,CheckBox } from 'react-native-elements'
import recipeDb from "../../data/recipe"

class ShoppingListScreen extends React.Component {
  constructor(props){
    super(props);

    // Ingredients holds all ingredients of selected meals
    this.state={
      ingredients:(this.createShoppingList(["School's Out Scalloped Potatoes", "Lentil Vegetable Soup", "Healthy Breakfast Muffins"]))
    }

  }
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
                    this.state.ingredients.map((item) => (
                      <CheckBox
                      title={item["ingredient"]}
                      checked={item["isChecked"]}
                      onPress={this.checkIngredients.bind(this,item["index"],item["ingredient"])}
                    />
                    ))
                }
            </ScrollView>
        </View>
      );
    }
    // Pulls ingredients with name of the meal
    // createShoppingList -- Input: Array of meal names
    //                       Output: Array of ingredients of each meal
    createShoppingList(mealNames) {
      let shoppingList = [];
      for (let mealNameIndex = 0; mealNameIndex < mealNames.length; mealNameIndex++ ) {
        for (let recipeIndex = 0; recipeIndex < recipeDb.length; recipeIndex++) {
          if (recipeDb[recipeIndex].name == mealNames[mealNameIndex]) {
            let tempname = "Ingredients for " + mealNames[mealNameIndex];
            shoppingList.push({ingredient:tempname});
            for (ingredientIndex = 0; ingredientIndex < recipeDb[recipeIndex].ingredients.length; ingredientIndex++) {
              let temp = "";
                if (recipeDb[recipeIndex].ingredients[ingredientIndex].measurement == "") {
                  temp += recipeDb[recipeIndex].ingredients[ingredientIndex].name;
                } else {
                  temp += recipeDb[recipeIndex].ingredients[ingredientIndex].name + recipeDb[recipeIndex].ingredients[ingredientIndex].amount + " " + recipeDb[recipeIndex].ingredients[ingredientIndex].measurement;
                }
                shoppingList.push({ingredient:temp,isChecked:false,index:shoppingList.length});
          }
          shoppingList.push("");
          break;
        }
      }
    }
    return shoppingList;
   }

   // Checks Off List Item on user click
   checkIngredients(id,name){
	// Very Slow, need to optimize, but it works!
    if(id !== undefined && name.search("Ingredients for ") == -1)
    {  
      this.state.ingredients[id]["isChecked"]=!this.state.ingredients[id]["isChecked"];
      this.state.ingredients[id]["ingredient"]=name;
      this.setState({ingredients:this.state.ingredients});
    }
     return;
    

   }
   
  }
  export default ShoppingListScreen;