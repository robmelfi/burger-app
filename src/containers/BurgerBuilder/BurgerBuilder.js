import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';


const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
};

class BurgerBuilder extends Component {

    state = {
      ingredients: null,
      totalPrice: 4,
      purchasable: false,
      purchasing: false,
      loading: false,
      error: null
    };

    componentDidMount () {
        // console.log(this.props);
        axios.get('https://react-my-burger-646ee.firebaseio.com/ingredients.json')
            .then( response => {
                this.setState({ingredients: response.data});
                //this.updateTotalPrice(this.state.ingredients);
                //this.updatePurchaseState(this.state.ingredients);
            })
            .catch( error => {
                this.setState({error: true});
            });
    }

    updateTotalPrice (ingredients) {
        const totalPrice = Object.keys(ingredients)
            .map( igKey => {
                return ingredients[igKey] * INGREDIENT_PRICES[igKey];
            })
            .reduce( (sum, el) => {
                return sum + el;
            }, 0);
        this.setState({totalPrice: this.state.totalPrice + totalPrice});
    }

    updatePurchaseState (ingredients) {

        const sum = Object.keys(ingredients)
            .map( igKey => {
                return ingredients[igKey]
            })
            .reduce( (sum, el) => {
                return sum + el;
            } , 0);

        this.setState({ purchasable: sum > 0 });

    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updateCount = oldCount + 1;
        const updateIngredients = {
            ...this.state.ingredients
        };
        updateIngredients[type] = updateCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ingredients: updateIngredients, totalPrice: newPrice});
        this.updatePurchaseState(updateIngredients);
    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updateCount = oldCount - 1;
        const updateIngredients = {
            ...this.state.ingredients
        };
        updateIngredients[type] = updateCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceAddition;
        this.setState({ingredients: updateIngredients, totalPrice: newPrice});
        this.updatePurchaseState(updateIngredients);
    };

    purchaseHandler = () => {
        this.setState({ purchasing: true});
    };

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false});
    };

    purchaseContinueHandler = () => {
        // alert('You continue!');
        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    };

    render () {
        const disableInfo = {
            ...this.state.ingredients
        };

        for (let key in disableInfo ) {
            disableInfo[key] = disableInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredient can't be loaded</p> : <Spinner/>;

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disableInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}/>
                </Aux>);

            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                totalPrice={this.state.totalPrice}/>;
        }

        if (this.state.loading) {
            orderSummary = <Spinner/>;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);