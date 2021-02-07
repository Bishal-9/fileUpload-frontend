import React, { Fragment, useState } from 'react'
import axios from 'axios'
import Message from './Message'
import Progress from './Progress'

function FileUpload() {

    const [file, setFile] = useState('')
    const [uploadedFile, setUploadedFile] = useState({})
    const [message, setMessage] = useState('')
    const [uploadPercentage, setUploadPercentage] = useState(0)

    const onChange = e => {
        setFile(e.target.files[0])
    }

    const onSubmit = async e => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)))

                    // Clear percentage
                    // setTimeout(() => setUploadPercentage(0), 10000)
                }
            })

            const { filename, filepath } = res.data

            setUploadedFile({ filename, filepath })
            setMessage('File Uploaded!')
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server')
            } else {
                setMessage(err.response.data.msg)
            }
        }
    }

    return (
        <Fragment>
            { message ? <Message msg={message} /> : null}
            <Progress percentage={uploadPercentage} />
            <form onSubmit={onSubmit}>
                <div className="input-group mb-3 mt-3">
                    <input onChange={onChange} type="file" className="form-control" id="inputGroupFile02" />                  
                    <input className="btn btn-primary btn-block bg-info" type="submit" value="Upload" />
                </div>
            </form>            
            {
                uploadedFile ? <div className="row mt-5">
                    <div className="col-md-6 m-auto">
                        <h3 className="text-center">{uploadedFile.filename}</h3>
                        <img src={uploadedFile.filepath} style={{ width: '100%' }} alt="" />
                    </div>
                </div> : null
            }
        </Fragment>
    )
}

export default FileUpload
