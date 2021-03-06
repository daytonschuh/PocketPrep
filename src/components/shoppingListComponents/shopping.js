import React from 'react';
import { View, ScrollView } from 'react-native';
import { Header, Text, ListItem, CheckBox } from 'react-native-elements';
import recipeDb from "../../data/recipe";
import { FileSystem } from 'expo';

class ShoppingListScreen extends React.Component {

  constructor(props) {
    super(props);
    // Ingredients holds all ingredients of selected meals
    this.state = {
      ingredients: []
    }

    // If mealNames is empty, it will generate an empty list
    // Only occurs when accessing through home menu

    this.fileUri = FileSystem.documentDirectory + 'custom.json';
    //FileSystem retrieves file information (exists), must await before accessing file
    this.grabCustomList();

    console.log('constructor call');
  }

  grabCustomList() {
    try {
      this.mealNames = this.props.navigation.state.params.compileNames;
    }
    catch (e) {
      console.log('Error Message', e);
    }
    FileSystem.getInfoAsync(this.fileUri).then((fileInfo) => {

      if (fileInfo["exists"] == true) {

        //FileSystem reads are asynchronous, must await before creating customMeals List
        fileread = async () => {
          let result = null;

          try {
            //Wait for FileSystem read to return a result string
            result = await FileSystem.readAsStringAsync(this.fileUri);

          } catch (e) {
            console.log(e);
          }
          //Parse result to object and store in Custom Meals List

          let dataAggregation = [...recipeDb, ...JSON.parse(result)];
          this.setState({ ingredients: this.createShoppingList(this.mealNames, dataAggregation) });

        }
        //Run async function
        fileread();
      }
      else {
        console.log('custom file does not exist');
        // Write Empty List 
        FileSystem.writeAsStringAsync(this.fileUri, JSON.stringify([]));
      }


    });

  }

  render() {
    try {
      if (this.props.navigation.state.params.shouldReset) {
        this.grabCustomList();
        this.state.ingredients.map((item) => {
          item['isChecked'] = false;

        });
        this.props.navigation.state.params.shouldReset = false;
        this.setState({ ingredients: this.state.ingredients });
      }
    }
    catch (e) {
      console.log(e);
    }

    // this.setState({ingredients:this.createShoppingList(this.state.mealNames,(recipeDb.concat(this.state.customMeals)))});
    return (
      <View style={{ flex: 1 }}>
        <Text h1 style={{ backgroundColor: '#0b486b', color: '#FFFFFF' }}>Shopping List</Text>

        <ScrollView >
          {
            this.state.ingredients.map((item, i) => (
              <CheckBox
                key={item["index"] + i.toString()}
                title={item["ingredient"]}
                checked={item["isChecked"]}
                // subtitle={item["mealName"]}
                onPress={this.checkIngredients.bind(this, item["index"], item["ingredient"])}
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
  createShoppingList(mealNames, database) {
    let shoppingList = [];
    if (mealNames != undefined) {
      for (let mealNameIndex = 0; mealNameIndex < mealNames.length; mealNameIndex++) {
        for (let recipeIndex = 0; recipeIndex < database.length; recipeIndex++) {
          if (database[recipeIndex].name == mealNames[mealNameIndex]) {
            // let tempname = "Ingredients for " + mealNames[mealNameIndex];
            // shoppingList.push({ingredient:tempname});
            for (ingredientIndex = 0; ingredientIndex < database[recipeIndex].ingredients.length; ingredientIndex++) {
              let temp = "";
              if (database[recipeIndex].ingredients[ingredientIndex].amount == 0) {
                temp += database[recipeIndex].ingredients[ingredientIndex].name;
              }
              else if (database[recipeIndex].ingredients[ingredientIndex].measurement == "") {
                temp += database[recipeIndex].ingredients[ingredientIndex].amount + " " + database[recipeIndex].ingredients[ingredientIndex].name;
              } else {
                temp += database[recipeIndex].ingredients[ingredientIndex].amount + " " + database[recipeIndex].ingredients[ingredientIndex].measurement + " " + database[recipeIndex].ingredients[ingredientIndex].name;
              }
              shoppingList.push({ ingredient: temp, isChecked: false, index: shoppingList.length, mealName: mealNames[mealNameIndex] });
            }
            shoppingList.push("");
            break;
          }
        }
      }
    }
    shoppingList.pop();
    return shoppingList;
  }

  // Checks Off List Item on user click
  checkIngredients(id, name) {
    // Very Slow, need to optimize, but it works!
    if (id !== undefined && name.search("Ingredients for ") == -1) {
      this.state.ingredients[id]["isChecked"] = !this.state.ingredients[id]["isChecked"];
      this.state.ingredients[id]["ingredient"] = name;
      this.setState({ ingredients: this.state.ingredients });
    }
    return;


  }

}
export default ShoppingListScreen;