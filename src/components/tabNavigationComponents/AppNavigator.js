import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import AddScreen from '../editMealsComponents/add-new-meal';

import IngredientScreen from '../viewMealsComponents/ingredients';

import DebugScreen from '../debug';

import viewDayScreen from '../calendarComponents/day-view';

import viewDayAddMeal from '../calendarComponents/day-add-meal';

import MainTabNavigator from './MainTabNavigator';

import MealListScreen from '../viewMealsComponents/view-meals';

import ShoppingListScreen from '../shoppingListComponents/shopping';

import SettingScreen from '../settingsComponents/setting-home'

export default createAppContainer(createStackNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  AddRecipe: AddScreen,
  Ingredients: IngredientScreen,
  Debugger:DebugScreen,
  MealView: MealListScreen,
  DayView: viewDayScreen,
  DayAddMeal: viewDayAddMeal,
  Shopping: ShoppingListScreen,
  Settings: SettingScreen
}));