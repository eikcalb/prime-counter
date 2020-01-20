import React from 'react'

/**
 * Table generates a representation for a 2D numeric array.
 * The rows and columns should be the same size.
 * 
 * All cells in this table will be identified by it cartesian coordinates.
 * 
 * @param {*} param0 Parameters
 */
export const Table = ({ headers, callback }) => {
    // const [state, setState] = React.useState({})

    return (
        <div className="table">
            <table>
                <thead>
                    <tr><th>.</th>
                        {headers.map((v, x) => {
                            return (
                                <th key={`head-${x}`}>{v}</th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {headers.map((v, y) => {
                        return (
                            <tr key={`body-${y}-${v}`}>
                                <th>{v}</th>
                                {[...generateRow(y, headers.length)]}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

function* generateRow(y, count) {
    for (let i = 0; i < count; i++) {
        yield (
            <td id={`x${i}y${y}`} key={`x${i}y${y}`}></td>
        )
    }
}