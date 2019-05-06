import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem, ButtonGroup, Button, Overlay, Text, Image } from 'react-native-elements';
import recipeData from '../../data/recipe';
import { FileSystem } from 'expo';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


class MealScreen extends React.Component {

  constructor(props) {
    super(props);

    this.readFile();

    this.state = {
      customMeals: [],
      presetMeals: recipeData,
      displayList: recipeData,
      selectedIndex: 0,
      overlayVisible: false,
      removeText: null
    }
    this.overlayBP = this.overlayBP.bind(this);
    this.overlayItem = null;
    this.updateIndex = this.updateIndex.bind(this);

  }

  readFile() {
    let currentCustomMeals = [];
    this.fileUri = FileSystem.documentDirectory + 'custom.json';
    //FileSystem reads are asynchronous, must await before creating MealPlanCalendar object
    FileSystem.getInfoAsync(this.fileUri).then((fileInfo) => {

      if (fileInfo["exists"] == true) {
        console.log('custom file exists');

        //FileSystem reads are asynchronous, must await before creating MealPlanCalendar object
        fileread = async () => {
          let result = null;

          try {
            //Wait for FileSystem read to return a result string
            result = await FileSystem.readAsStringAsync(this.fileUri);

          } catch (e) {
            console.log(e);
          }
          //Parse result to object and store in MealPlanCalendar
          currentCustomMeals = JSON.parse(result);
          this.setState({ customMeals: currentCustomMeals });
          console.log(currentCustomMeals);
          //    console.log(currentCustomMeals);
        }
        //Run async function
        fileread();
      }
      else {
        console.log('custom file does not exist');
        //create the file based on app's asset
        currentCustomMeals = [];
        FileSystem.writeAsStringAsync(this.fileUri, JSON.stringify(currentCustomMeals));

      }

    });
  }

  updateIndex(selectedIndex) {
    console.log(this.state.customMeals);
    this.setState({ selectedIndex });
    if (selectedIndex == 0)
      this.setState({ displayList: this.state.presetMeals });
    else
      this.setState({ displayList: this.state.customMeals });
  }
  render() {
    const buttons = ['Preset', 'Custom'];
    const overlayButtons = ['Yes', 'No'];
    const { selectedIndex } = this.state;

    return (
      <View style={{ flex: 1}}>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={{ height: '10%' }}
        />
        <Overlay
          isVisible={this.state.overlayVisible}
          onBackdropPress={this.hideOverlay.bind(this)}
          height={'auto'}
        >
          <>
            <Text>Delete "{this.overlayItem}"?</Text>
            <ButtonGroup
              onPress={this.overlayBP}
              buttons={overlayButtons}
              containerStyle={{ top: 16 }}
            />
            <Text>{this.state.removeText}</Text>
          </>
        </Overlay>

        <ScrollView style={{ height: '85%' }} >
          {
            this.state.displayList.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                topDivider={true}
                bottomDivider={true}
                rightIcon={this.handleViewIcon(l.name)}
              // onPress={this.handleMealSend.bind(this,l.name)}
              />
            ))
          }
        </ScrollView>
        {this.handleViewAddButton()}
      </View>
    );
  }
  displayOverlay(name) {
    this.overlayItem = name;
    this.setState({ overlayVisible: true });
  }

  hideOverlay() {
    this.overlayItem = null;
    this.setState({ overlayVisible: false, removeText: null });
  }
  handleViewIcon(itemName) {
    if (this.state.selectedIndex == 1) {
      return (
        <Icon
          name={Platform.OS === 'ios' ? 'ios-close-circle' : 'md-close-circle'}
          size={28}
          color='red'
          onPress={this.displayOverlay.bind(this, itemName)}
        />
      );
    }
    else {
      return;
    }
  }
  handleViewAddButton() {

    if (this.state.selectedIndex == 1) {
      if (this.state.customMeals < 1){
        return(
          <View style={{ justifyContent: 'center', alignItems: 'center'}}>
          <Image
          style ={{justifyContent: 'center', width: 130, height: 130}}
          source = {require('../../../assets/sad_robot.png')}/>
          <Text style={{textAlign: 'center', fontSize: 16}}>It appears you haven't created a custom meal yet.
            Would you like to try it
          <Text style = {{color: 'blue', textAlign: 'center', fontSize: 16}} onPress={() => this.props.navigation.navigate('AddRecipe')}> now?
          </Text>
          </Text>
          </View>
        )
      }
      return (

        <TouchableOpacity
        style={styles.primarybutton}
        onPress ={() => this.props.navigation.navigate('AddRecipe')}
      >
      <Text style = {{color: '#FFFFFF'}}> Create a Meal </Text>
      </TouchableOpacity>
      );
    }
    else {
      return;
    }
  }
  handleMealSend(name) {
    const { navigate } = this.props.navigation;
    // Send name of the meal to the Ingredients Screen Component (ingredients.js)
    navigate('Ingredients', { mealName: name })

    return;
  }
  async overlayBP(selectedIndex) {
    if (selectedIndex == 0) {
      //set state for state saying its being removed
      this.setState({ removeText: 'Removing...' });
      //await removal

      this.deleteMeal(this.overlayItem);

      //hide overlay
      this.hideOverlay();
    }
    if (selectedIndex == 1)
      this.hideOverlay();

  }

  deleteMeal(name) {
    currentCustomMeals = this.state.customMeals;
    let index = 0;
    for (i = 0; i < currentCustomMeals.length; i++) {
      if (currentCustomMeals[i].name == name) {
        index = i;
      }
    }
    currentCustomMeals.splice(index, 1);
    FileSystem.writeAsStringAsync(this.fileUri, JSON.stringify(currentCustomMeals));
    this.setState({ customMeals: currentCustomMeals });
  }

}

const styles = StyleSheet.create({
  primarybutton: {
    alignItems: 'center',
    backgroundColor: '#337ab7',
    padding: 10
  }
})
export default MealScreen;