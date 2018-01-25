import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {

    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    };

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Roberto',
                address: {
                    street: 'via napoli',
                    zipCode: '00202',
                    country: 'Italy'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        };
        axios.post('/orders.json', order)
            .then( response => {
                this.setState({ loading: false });
                this.props.history.push('/');
            })
            .catch( error => {
                this.setState({ loading: false });
            });
    };

    render () {
        let form = (<form>
                        <Input inputtype="text" name="name" placeholder="Your name" />
                        <Input inputtype="email" name="email" placeholder="Your email" />
                        <Input inputtype="text" name="street" placeholder="Your street" />
                        <Input inputtype="text" name="postal" placeholder="Your postal code" />
                        <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
                    </form>);
        if (this.state.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;