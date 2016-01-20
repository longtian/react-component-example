/**
 * Created by yan on 16-1-20.
 */
import React from 'react';
import MyComponent from '../../lib/MyComponent';
import {render} from 'react-dom';

var element = document.createElement("div");
document.body.appendChild(element);
render(<MyComponent name="myComponent"/>, element);