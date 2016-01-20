/**
 * Created by yan on 16-1-20.
 */
import React from 'react';

const MyComponent = props=> {
  return <div>
    props:
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </div>
}

export default MyComponent;