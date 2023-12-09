import React from 'react';

        const TableComponent = ({ searchResult, showJsonInSplitPage, handleCellClick, modalContent, handleClose, position, rowJson, handleSplitPanelClose }) => {
          return (
            <>
            <table className='td-border w-full'>
              <thead>
                <tr>
                  <th className="border-x border-y border-gray-500"></th>
                  <th className="border-x border-y border-gray-500">datetime</th>
                  <th className="border-x border-y border-gray-500">level</th>
                  <th className="border-x border-y border-gray-500">msgType</th>
                  <th className="border-x border-y border-gray-500">msg</th>
                  <th className="border-x border-y border-gray-500">uriTemplate</th>
                  <th className="border-x border-y border-gray-500">reqHeaders</th>
                  <th className="border-x border-y border-gray-500">reqPayload</th>
                  <th className="border-x border-y border-gray-500">resPayload</th>
                  <th className="border-x border-y border-gray-500">traceId</th>
                </tr>
              </thead>
              <tbody>
                {searchResult.map((val, idx) =>
                  (val && <tr key={idx}>{/* on click of a table cell show cell content in a popup*/}
                    <td onClick={() => showJsonInSplitPage(val)}>Expand</td>
                    <td>{val.datetime}</td>
                    <td>{val.level}</td>
                    <td onClick={(e) => handleCellClick(e)}>{val.msgType}</td>
                    <td><div className='truncate overflow-hidden hover:overflow-auto w-40 h-14' onClick={(e) => handleCellClick(e)}>{val.msg}</div></td>
                    <td><div className='truncate hover:overflow-auto w-40 h-14' onClick={(e) => handleCellClick(e)}>{val.uriTemplate}</div></td>
                    <td className='relative'><div className='truncate  hover:overflow-auto w-40 h-14 text-left align-top' onClick={(e) => handleCellClick(e)}>{JSON.stringify(val.reqHeaders)}</div></td>
                    <td><div className='truncate overflow-hidden hover:overflow-auto w-40 h-14' onClick={(e) => handleCellClick(e)}>{JSON.stringify(val.reqPayload)}</div></td>
                    <td><div className='truncate overflow-hidden hover:overflow-auto w-40 h-14' onClick={(e) => handleCellClick(e)}>{JSON.stringify(val.resPayload)}</div></td>
                    <td>{val.traceId}</td>
                  </tr>)
                )}
              </tbody>
            </table>
            {modalContent && <Modal content={modalContent} onClose={handleClose} position={position} />}
            {rowJson && <SpitPanel rowJson={rowJson} onClose={handleSplitPanelClose} />}
            </>
          );
        }

        export default TableComponent;