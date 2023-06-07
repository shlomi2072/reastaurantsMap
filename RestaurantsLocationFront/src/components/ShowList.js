import React, { useState } from 'react';


//resive araay with what want to diplay
export default function ShowList(props) {
    return (
      <div>
        <div>
          <ol>
            {props.data.map((element, index) => (
              <li key={index}>{element.name}</li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
  