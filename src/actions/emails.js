import fetch from 'isomorphic-fetch';
import request from '../_config/superagent';

import {
  EMAIL_ARRAY_FETCH,
  EMAIL_ARRAY_REQUEST,
  EMAIL_ARRAY_FETCH_SUCCESS,
  EMAIL_ARRAY_FETCH_ERROR,

  ALL_EMAIL_FETCH_REQUEST,
  ALL_EMAIL_FETCH_SUCCESS,
  ALL_EMAIL_FETCH_ERROR,

  CLEAR_ALL_EMAILS_CACHE,

  EMAIL_SHOW_ONE_FLAG,
  EMAIL_SHOW_ALL_FLAGS,
  EMAIL_SHOW_COMPLETE,

  ALL_EMAILS_SHOW_ONE_FLAG,
  ALL_EMAILS_SHOW_ALL_FLAGS,
  ALL_EMAILS_SHOW_COMPLETE,
  
  REQUESTING_EMAIL_UNFLAG,
  EMAIL_UNFLAG_ERROR,
  EMAIL_UNFLAG_SUCCESS,
  EMAIL_MARK_READ_REQUEST,
  EMAIL_MARK_READ_SUCCESS,

} from 'constants/emails';

var serverUrl = 'http://127.0.0.1:4000';

export function emailArrayFetch() {
  console.log('emailArrayFetch triggered');
  return dispatch => {
    dispatch(emailArrayRequest());
    return request
      .get(serverUrl + '/emailData')
      .end((err, res={}) => {
        dispatch(emailArrayFetchSuccess(res.body));
      });

    // fetch('http://localhost:4000/emailData')
    //   .then(req => { console.log('this is req', req);
    //     return req.json(); })
    //   .then(json => { dispatch(emailArrayFetchSuccess(json)); });
  };
}

export function emailArrayRequest() {
  console.log('emailArrayRequest triggered');
  return {
    type: EMAIL_ARRAY_REQUEST,
  };
}

export function emailArrayFetchSuccess(emailsArray) {
  console.log('triggered emailarrayfetchsuccess');
  return {
    type: EMAIL_ARRAY_FETCH_SUCCESS,
    payload: {
      emailsArray,
      receivedAt: Date.now(),
    },
  };
}

export function emailArrayFetchError(error) {
  return {
    type: EMAIL_ARRAY_FETCH_ERROR,
    payload: { error },
  };
}

//fetches ALL emails that were initially flagged
export function allEmailArrayFetch() {
  console.log('allemailArrayFetch triggered');
  return dispatch => {
    dispatch(allEmailArrayRequest());
    return request
    //TODO: change URL
      .get(serverUrl + '/allEmails')
      .end((err, res={}) => {
        if (err) {
          dispatch(allEmailArrayFetchError(err))
        } else {
          dispatch(allEmailArrayFetchSuccess(res.body));
        }
      });
  };
}

export function allEmailArrayRequest() {
  return {
    type: ALL_EMAIL_FETCH_REQUEST,
  };
}

export function allEmailArrayFetchSuccess(allEmailsArray) {
  return {
    type: ALL_EMAIL_FETCH_SUCCESS,
    payload: {
      allEmailsArray,
    },
  };
}

export function allEmailArrayFetchError(error) {
  return {
    type: ALL_EMAIL_FETCH_ERROR,
    payload: { error },
  };
}

export function clearAllEmailCache() {
  return {
    type: CLEAR_ALL_EMAILS_CACHE,
  }
}

export function emailShowOneFlag(emailId) {
  console.log('actionShowOneFlag', emailId);
  return {
    type: EMAIL_SHOW_ONE_FLAG,
    payload: { emailId },
  };
}

export function emailShowAllFlags(emailId) {
  return {
    type: EMAIL_SHOW_ALL_FLAGS,
    payload: { emailId },
  };
}

export function emailShowComplete(emailId) {
  return {
    type: EMAIL_SHOW_COMPLETE,
    payload: { emailId },
  };
}

export function allEmailsShowOneFlag(emailId) {
  console.log('actionShowOneFlag', emailId);
  return {
    type: ALL_EMAILS_SHOW_ONE_FLAG,
    payload: { emailId },
  };
}

export function allEmailsShowAllFlags(emailId) {
  return {
    type: ALL_EMAILS_SHOW_ALL_FLAGS,
    payload: { emailId },
  };
}

export function allEmailsShowComplete(emailId) {
  return {
    type: ALL_EMAILS_SHOW_COMPLETE,
    payload: { emailId },
  };
}

export function unflagEmail(emailID) {
  return dispatch => {
    dispatch(unflagEmailRequest(emailID));
    return request
      .post(serverUrl + '/unflagEmail')
      .send({
        emailID: emailID,
      })
      .end((err, res={}) => {
        err ? dispatch(emailUnflagError(err)) :
        dispatch(emailUnflagSuccess());
      });
  };
}

export function unflagEmailRequest(emailID) {
  return {
    type: REQUESTING_EMAIL_UNFLAG,
    payload: { emailID },
  };
}

export function emailUnflagError(error) {
  return {
    type: EMAIL_UNFLAG_ERROR,
    payload: {error},
  };
}

export function emailUnflagSuccess() {
  return dispatch => {
    dispatch(emailArrayFetch());
    return {
      type: EMAIL_UNFLAG_SUCCESS,
    };
  };
}

export function emailMarkRead(emailID){
  return dispatch => {
    return request
      .post(serverUrl + '/emailMarkRead')
      .send({
        emailID: emailID
      })
      .end((err, res) => {
        if(err){
          console.log(err);
        }else{
          dispatch(emailMarkReadSuccess(res.body.emailID));
        }
    })   
  }
}

export function emailMarkReadSuccess(emailID){
  return dispatch => {
    dispatch(emailArrayFetch());
    return {
      type:EMAIL_MARK_READ_SUCCESS,
      payload: {emailID}
    }
  }
}
