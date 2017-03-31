import React, {Component} from 'react';

export default class PalindromeView extends Component {
render() {
  return(
      <div>
        {this.props.s.map((f) => ([
          <ul key={f.id}>
            <h4 key={f.nameId}>{f.filename} </h4>
            <p key={f.countId}> Count: {f.palindromeCount}</p>
            {f.palindromes.map((g, index) => <li key={index}>{g}</li>)}
          </ul>
          ])
        )}
      </div>
    )
  }

}
