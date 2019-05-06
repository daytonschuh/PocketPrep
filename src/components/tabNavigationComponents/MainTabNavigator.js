import React from 'react';

import { Platform } from 'react-native';

import { createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import CalendarScreen from '../calendarComponents/calendar';

import ShoppingListScreen from '../shoppingListComponents/shopping';

import MealListScreen from '../viewMealsComponents/view-meals'

import SettingScreen from '../settingsComponents/setting-home'

import { NavigationActions, StackActions } from 'react-navigation';


const CalendarStack = createSwitchNavigator({
  Calendar: CalendarScreen
});

CalendarStack.navigationOptions = {
  tabBarLabel: 'Calendar',

	tabBarIcon: ({ focused }) => (
    <FontAwesome
      focused={focused}
      name={"calendar"}
      size = {26}
    />
  ),
};


const ShoppingStack = createSwitchNavigator({
  Shopping: ShoppingListScreen,
});


ShoppingStack.navigationOptions = {
  tabBarLabel: 'Shopping List',
  tabBarIcon: ({ focused }) => (
    <FontAwesome
      focused={focused}
      name={'shopping-cart'}
      size = {26}
    />
  ),
};

const MealStack = createSwitchNavigator({
    Meals: MealListScreen,
});

const resetMealView = StackActions.reset({
	index: 0,
	actions: [NavigationActions.navigate({routeName: 'Main'})],
});

MealStack.navigationOptions = {
    tabBarLabel: 'Meals',
    tabBarIcon: ({focused}) => (
        <FontAwesome focused = {focused}
        name={'cutlery'}
        size={26}
        />
    ),
	
	tabBarOnPress: ({ navigation, defaultHandler }) => {
		if(navigation.getParam('resetCustom', false) == true){
			//Set the resetCustom flag in MealStack to false
			navigation.setParams({resetCustom: false});
			//Reset Stack
			navigation.dispatch(resetMealView);
			//navigates to Meal Tab
			defaultHandler();
		}
		else
			defaultHandler();
	}
}

const SettingStack = createSwitchNavigator({
  Settings: SettingScreen,
});

SettingStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({focused}) => (
      <FontAwesome focused = {focused}
      name={'cogs'}
      size={26}
      />
  )
}


export default createBottomTabNavigator({
  CalendarStack,
  ShoppingStack,
  MealStack,
  SettingStack
});
