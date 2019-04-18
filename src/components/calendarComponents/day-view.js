import React from 'react';
import { View, ScrollView } from 'react-native';
import { Header,ListItem,Text,Input,Button, Divider, ButtonGroup, Overlay } from 'react-native-elements';
import MealManager from '../editMealsComponents/meal-manager';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class viewDayScreen extends React.Component {
	
	constructor (props) {
        super(props)
        
		this.MM = null;
		
		this.bArray = [];
		this.lArray = [];
		this.dArray = [];
		
		this.constructMealPlan();
		
		this.state = {
        selectedIndex: 0,
		activeList: this.bArray,
		overlayVisible: false
        }
        this.updateIndex = this.updateIndex.bind(this);
		
		this.isLoading = true;
    }
	
	async constructMealPlan() {
		
		let mm = new MealManager();
		
		await mm.init();
		
		this.MM = mm;
		
		//console.log('mealplancalendar object: ' + JSON.stringify(mm));
		
		let mp = mm.getMealPlan(this.props.navigation.state.params.dayChosen);
		
		console.log('mealplan object: ' + JSON.stringify(mp));
		
		let Bstr = '', Lstr = '', Dstr = '';
		
		if(mp != undefined) {
			
			this.bArray = mp.Breakfast;
			this.lArray = mp.Lunch;
			this.dArray = mp.Dinner;	
		}
		
		this.setState({isLoading : false,activeList:this.bArray});
	}
    
    updateIndex (selectedIndex) {
        this.setState({selectedIndex});
		if(selectedIndex == 0)
			this.setState({activeList:this.bArray});
		if(selectedIndex == 1)
			this.setState({activeList:this.lArray});
		if(selectedIndex == 2)
			this.setState({activeList:this.dArray});
    }

  render() {
    const buttons = ['Breakfast', 'Lunch', 'Dinner']
    const { selectedIndex } = this.state

    dayChosen = this.props.navigation.state.params.dayChosen

    currIndex = selectedIndex
	
	if(this.state.isLoading){
		return (<View></View>) ;
	}
	
      return (
        <View>
          {console.log(this.props.navigation.state.params.dayChosen)}
			<Overlay 
				isVisible={this.state.overlayVisible}
				onBackdropPress={ this.hideOverlay.bind(this) }
			>
				<Text>'Hello from Overlay!'</Text>
			</Overlay>
            <Header
            placement="left"
            leftComponent={{ icon: 'menu', color: '#fff' }}
            centerComponent={{ text: this.props.navigation.state.params.dayChosen, style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff' }}
            />
            <Text h1>{this.props.navigation.state.params.dayChosen}</Text>
            <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={{height: 100}}
            />
			<ScrollView style={{height:'40%'}}>
				{
					this.state.activeList.map( (name) => (
					<ListItem
						key={name}
                        title={name}
						topDivider={true}
						bottomDivider={true}
						// TODO: Need Icon to be touchable/button, to display overlay message to confirm deleting meal
						rightIcon=<Icon 
							name = {Platform.OS === 'ios' ? 'ios-close-circle' : 'md-close-circle'}
							size = {28}
							color = 'red'
							onPress = { this.displayOverlay.bind(this) }
						/>
                    />
					))
				}
			</ScrollView>
			<Button title='Add a meal'
				onPress={() => this.props.navigation.navigate('DayAddMeal', dayChosen, currIndex)}
            />
        
        </View>
      );
    }
	
	displayOverlay(){
		this.setState({overlayVisible:true});
	}
	
	hideOverlay(){
		this.setState({overlayVisible:false});
	}

  }
  export default viewDayScreen;