import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type AddOn = {
  __typename?: 'AddOn';
  type: Scalars['String'];
  value?: Maybe<Scalars['Float']>;
};

export type AddOnInput = {
  type: Scalars['String'];
  value?: InputMaybe<Scalars['Float']>;
};

export type Admin = {
  __typename?: 'Admin';
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  createdBy: Admin;
  email: Scalars['String'];
  name: Scalars['String'];
  type: AdminRole;
  updatedAt: Scalars['DateTime'];
};

/** Enum For Type of Admin Roles i.e. Master, Admin & Normal */
export enum AdminRole {
  Employee = 'employee',
  Manager = 'manager',
  Master = 'master'
}

export type Mutation = {
  __typename?: 'Mutation';
  addService: Scalars['Boolean'];
};


export type MutationAddServiceArgs = {
  input: Array<ServicesInput>;
};

export type Query = {
  __typename?: 'Query';
  addUserService: Scalars['Boolean'];
  completeAccount: Scalars['Boolean'];
  getAllService: Array<Services>;
  getS3SignedURL: Scalars['String'];
  getServiceDetails: Array<Services>;
  getUserServiceDetailsById?: Maybe<UserServices>;
  initiatePayment: Scalars['String'];
  login: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  me: User;
  register: Scalars['Boolean'];
  updatePorjectName: Scalars['Boolean'];
  verifyUser: Scalars['Boolean'];
};


export type QueryAddUserServiceArgs = {
  input: UserServicesInput;
};


export type QueryCompleteAccountArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  number: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
};


export type QueryGetServiceDetailsArgs = {
  input: ServicesDetailInput;
};


export type QueryGetUserServiceDetailsByIdArgs = {
  serviceId: Scalars['String'];
};


export type QueryInitiatePaymentArgs = {
  email?: InputMaybe<Scalars['String']>;
  service: UserServicesInput;
};


export type QueryLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  token?: InputMaybe<Scalars['String']>;
};


export type QueryRegisterArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  number: Scalars['String'];
  password: Scalars['String'];
  token?: InputMaybe<Scalars['String']>;
};


export type QueryUpdatePorjectNameArgs = {
  projectName: Scalars['String'];
  serviceId: Scalars['String'];
};


export type QueryVerifyUserArgs = {
  token: Scalars['String'];
};

export type RevisionFiles = {
  __typename?: 'RevisionFiles';
  description?: Maybe<Scalars['String']>;
  file?: Maybe<Scalars['String']>;
  revision: Scalars['Float'];
};

export type ServiceStatusObject = {
  __typename?: 'ServiceStatusObject';
  name?: Maybe<UserServiceStatus>;
  state: ServiceStatusObjectState;
};

/** Enum for state */
export enum ServiceStatusObjectState {
  Completed = 'completed',
  Current = 'current',
  Pending = 'pending'
}

export type Services = {
  __typename?: 'Services';
  _id: Scalars['ID'];
  addOn: Array<AddOn>;
  createdAt: Scalars['DateTime'];
  deliveryDays?: Maybe<Scalars['Float']>;
  /** File formats for delivery file */
  deliveryFileFormat: Array<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  estimatedTime?: Maybe<Scalars['Float']>;
  for?: Maybe<Scalars['String']>;
  inputTrackLimit?: Maybe<Scalars['Float']>;
  mainCategory: Scalars['String'];
  maxFileDuration?: Maybe<Scalars['Float']>;
  mixProcessingDelays?: Maybe<Scalars['String']>;
  mixProcessingOtherFx?: Maybe<Scalars['String']>;
  mixProcessingReverbs?: Maybe<Scalars['String']>;
  mixVocalTuning?: Maybe<Scalars['String']>;
  numberOfReferenceFileUploads?: Maybe<Scalars['Float']>;
  price: Scalars['Float'];
  revisionsDelivery?: Maybe<Scalars['Float']>;
  serviceName: Scalars['String'];
  setOfRevisions?: Maybe<Scalars['Float']>;
  subCategory: Scalars['String'];
  subService?: Maybe<Scalars['String']>;
  subService2?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  /** File formats for uploading file */
  uploadFileFormat: Array<Scalars['String']>;
};

export type ServicesDetailInput = {
  mainCategory: Scalars['String'];
  serviceName: Scalars['String'];
  subCategory: Scalars['String'];
  subService?: InputMaybe<Scalars['String']>;
};

export type ServicesInput = {
  addOn: Array<AddOnInput>;
  deliveryDays?: InputMaybe<Scalars['Float']>;
  /** File formats for delivery file */
  deliveryFileFormat: Array<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  estimatedTime?: InputMaybe<Scalars['Float']>;
  for?: InputMaybe<Scalars['String']>;
  inputTrackLimit?: InputMaybe<Scalars['Float']>;
  mainCategory: Scalars['String'];
  maxFileDuration?: InputMaybe<Scalars['Float']>;
  mixProcessingDelays?: InputMaybe<Scalars['String']>;
  mixProcessingOtherFx?: InputMaybe<Scalars['String']>;
  mixProcessingReverbs?: InputMaybe<Scalars['String']>;
  mixVocalTuning?: InputMaybe<Scalars['String']>;
  numberOfReferenceFileUploads?: InputMaybe<Scalars['Float']>;
  price: Scalars['Float'];
  revisionsDelivery?: InputMaybe<Scalars['Float']>;
  serviceName: Scalars['String'];
  setOfRevisions?: InputMaybe<Scalars['Float']>;
  subCategory: Scalars['String'];
  subService?: InputMaybe<Scalars['String']>;
  subService2?: InputMaybe<Scalars['String']>;
  /** File formats for uploading file */
  uploadFileFormat: Array<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  accountVerified: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  lastLoggedIn?: Maybe<Scalars['DateTime']>;
  lastLoggedOut?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['String']>;
  services: Array<UserServices>;
  updatedAt: Scalars['DateTime'];
};

/** Enum for status of user service */
export enum UserServiceStatus {
  Completed = 'completed',
  Delivered = 'delivered',
  Pendingupload = 'pendingupload',
  Revisiondelivered = 'revisiondelivered',
  Revisionrequest = 'revisionrequest',
  Underreview = 'underreview',
  Workinprogress = 'workinprogress'
}

export type UserServices = {
  __typename?: 'UserServices';
  _id: Scalars['ID'];
  addOn: Array<AddOn>;
  assignedBy?: Maybe<Admin>;
  assignedTo?: Maybe<Admin>;
  createdAt: Scalars['DateTime'];
  deliveryDays?: Maybe<Scalars['Float']>;
  /** File formats for delivery file */
  deliveryFileFormat: Array<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  estimatedTime?: Maybe<Scalars['Float']>;
  for?: Maybe<Scalars['String']>;
  inputTrackLimit?: Maybe<Scalars['Float']>;
  mainCategory: Scalars['String'];
  maxFileDuration?: Maybe<Scalars['Float']>;
  mixProcessingDelays?: Maybe<Scalars['String']>;
  mixProcessingOtherFx?: Maybe<Scalars['String']>;
  mixProcessingReverbs?: Maybe<Scalars['String']>;
  mixVocalTuning?: Maybe<Scalars['String']>;
  numberOfReferenceFileUploads?: Maybe<Scalars['Float']>;
  paid: Scalars['Boolean'];
  price: Scalars['Float'];
  projectName?: Maybe<Scalars['String']>;
  referenceFiles: Array<Scalars['String']>;
  reupload?: Maybe<Scalars['DateTime']>;
  revisionFiles: Array<RevisionFiles>;
  revisionsDelivery?: Maybe<Scalars['Float']>;
  serviceName: Scalars['String'];
  setOfRevisions?: Maybe<Scalars['Float']>;
  status: Array<ServiceStatusObject>;
  statusType: UserServiceStatus;
  subCategory: Scalars['String'];
  subService?: Maybe<Scalars['String']>;
  subService2?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  /** File formats for uploading file */
  uploadFileFormat: Array<Scalars['String']>;
  uploadedFiles: Array<Scalars['String']>;
};

export type UserServicesInput = {
  addOn: Array<AddOnInput>;
  deliveryDays?: InputMaybe<Scalars['Float']>;
  /** File formats for delivery file */
  deliveryFileFormat: Array<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  estimatedTime?: InputMaybe<Scalars['Float']>;
  for?: InputMaybe<Scalars['String']>;
  inputTrackLimit?: InputMaybe<Scalars['Float']>;
  mainCategory: Scalars['String'];
  maxFileDuration?: InputMaybe<Scalars['Float']>;
  mixProcessingDelays?: InputMaybe<Scalars['String']>;
  mixProcessingOtherFx?: InputMaybe<Scalars['String']>;
  mixProcessingReverbs?: InputMaybe<Scalars['String']>;
  mixVocalTuning?: InputMaybe<Scalars['String']>;
  numberOfReferenceFileUploads?: InputMaybe<Scalars['Float']>;
  price: Scalars['Float'];
  projectName?: InputMaybe<Scalars['String']>;
  revisionsDelivery?: InputMaybe<Scalars['Float']>;
  serviceName: Scalars['String'];
  setOfRevisions?: InputMaybe<Scalars['Float']>;
  subCategory: Scalars['String'];
  subService?: InputMaybe<Scalars['String']>;
  subService2?: InputMaybe<Scalars['String']>;
  /** File formats for uploading file */
  uploadFileFormat: Array<Scalars['String']>;
};

export type GetServiceDetailsQueryVariables = Exact<{
  input: ServicesDetailInput;
}>;


export type GetServiceDetailsQuery = { __typename?: 'Query', getServiceDetails: Array<{ __typename?: 'Services', _id: string, mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, for?: string | null, description?: string | null, estimatedTime?: number | null, price: number, inputTrackLimit?: number | null, uploadFileFormat: Array<string>, deliveryFileFormat: Array<string>, deliveryDays?: number | null, maxFileDuration?: number | null, numberOfReferenceFileUploads?: number | null, setOfRevisions?: number | null, revisionsDelivery?: number | null, mixVocalTuning?: string | null, mixProcessingReverbs?: string | null, mixProcessingDelays?: string | null, mixProcessingOtherFx?: string | null, createdAt: any, updatedAt: any, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null }> }> };

export type UserServicesFragment = { __typename?: 'UserServices', _id: string, mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, for?: string | null, description?: string | null, estimatedTime?: number | null, price: number, inputTrackLimit?: number | null, uploadFileFormat: Array<string>, deliveryFileFormat: Array<string>, deliveryDays?: number | null, maxFileDuration?: number | null, numberOfReferenceFileUploads?: number | null, setOfRevisions?: number | null, revisionsDelivery?: number | null, mixVocalTuning?: string | null, mixProcessingReverbs?: string | null, mixProcessingDelays?: string | null, mixProcessingOtherFx?: string | null, projectName?: string | null, paid: boolean, uploadedFiles: Array<string>, referenceFiles: Array<string>, statusType: UserServiceStatus, reupload?: any | null, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null }>, revisionFiles: Array<{ __typename?: 'RevisionFiles', description?: string | null, file?: string | null, revision: number }>, status: Array<{ __typename?: 'ServiceStatusObject', name?: UserServiceStatus | null, state: ServiceStatusObjectState }> };

export type LoginQueryVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
  token?: InputMaybe<Scalars['String']>;
}>;


export type LoginQuery = { __typename?: 'Query', login: boolean };

export type RegisterQueryVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
  number: Scalars['String'];
  name: Scalars['String'];
  token?: InputMaybe<Scalars['String']>;
}>;


export type RegisterQuery = { __typename?: 'Query', register: boolean };

export type CompleteAccountQueryVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
  number: Scalars['String'];
  name: Scalars['String'];
  token: Scalars['String'];
}>;


export type CompleteAccountQuery = { __typename?: 'Query', completeAccount: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', _id: string, name?: string | null, email: string, number?: string | null, lastLoggedIn?: any | null, lastLoggedOut?: any | null, accountVerified: boolean, createdAt: any, updatedAt: any, services: Array<{ __typename?: 'UserServices', _id: string, mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, for?: string | null, description?: string | null, estimatedTime?: number | null, price: number, inputTrackLimit?: number | null, uploadFileFormat: Array<string>, deliveryFileFormat: Array<string>, deliveryDays?: number | null, maxFileDuration?: number | null, numberOfReferenceFileUploads?: number | null, setOfRevisions?: number | null, revisionsDelivery?: number | null, mixVocalTuning?: string | null, mixProcessingReverbs?: string | null, mixProcessingDelays?: string | null, mixProcessingOtherFx?: string | null, projectName?: string | null, paid: boolean, uploadedFiles: Array<string>, referenceFiles: Array<string>, statusType: UserServiceStatus, reupload?: any | null, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null }>, revisionFiles: Array<{ __typename?: 'RevisionFiles', description?: string | null, file?: string | null, revision: number }>, status: Array<{ __typename?: 'ServiceStatusObject', name?: UserServiceStatus | null, state: ServiceStatusObjectState }> }> } };

export type LogoutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutQuery = { __typename?: 'Query', logout: boolean };

export type InitiatePaymentQueryVariables = Exact<{
  service: UserServicesInput;
  email?: InputMaybe<Scalars['String']>;
}>;


export type InitiatePaymentQuery = { __typename?: 'Query', initiatePayment: string };

export type UpdatePorjectNameQueryVariables = Exact<{
  serviceId: Scalars['String'];
  projectName: Scalars['String'];
}>;


export type UpdatePorjectNameQuery = { __typename?: 'Query', updatePorjectName: boolean };

export type GetUserServiceDetailsByIdQueryVariables = Exact<{
  serviceId: Scalars['String'];
}>;


export type GetUserServiceDetailsByIdQuery = { __typename?: 'Query', getUserServiceDetailsById?: { __typename?: 'UserServices', _id: string, mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, for?: string | null, description?: string | null, estimatedTime?: number | null, price: number, inputTrackLimit?: number | null, uploadFileFormat: Array<string>, deliveryFileFormat: Array<string>, deliveryDays?: number | null, maxFileDuration?: number | null, numberOfReferenceFileUploads?: number | null, setOfRevisions?: number | null, revisionsDelivery?: number | null, mixVocalTuning?: string | null, mixProcessingReverbs?: string | null, mixProcessingDelays?: string | null, mixProcessingOtherFx?: string | null, projectName?: string | null, paid: boolean, uploadedFiles: Array<string>, referenceFiles: Array<string>, statusType: UserServiceStatus, reupload?: any | null, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null }>, revisionFiles: Array<{ __typename?: 'RevisionFiles', description?: string | null, file?: string | null, revision: number }>, status: Array<{ __typename?: 'ServiceStatusObject', name?: UserServiceStatus | null, state: ServiceStatusObjectState }> } | null };

export type VerifyUserQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyUserQuery = { __typename?: 'Query', verifyUser: boolean };

export type GetS3SignedUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type GetS3SignedUrlQuery = { __typename?: 'Query', getS3SignedURL: string };

export const UserServicesFragmentDoc = gql`
    fragment userServices on UserServices {
  _id
  mainCategory
  subCategory
  serviceName
  subService
  subService2
  for
  description
  estimatedTime
  price
  inputTrackLimit
  uploadFileFormat
  deliveryFileFormat
  deliveryDays
  maxFileDuration
  numberOfReferenceFileUploads
  setOfRevisions
  revisionsDelivery
  mixVocalTuning
  mixProcessingReverbs
  mixProcessingDelays
  mixProcessingOtherFx
  addOn {
    type
    value
  }
  projectName
  paid
  uploadedFiles
  referenceFiles
  revisionFiles {
    description
    file
    revision
  }
  statusType
  status {
    name
    state
  }
  reupload
}
    `;
export const GetServiceDetailsDocument = gql`
    query GetServiceDetails($input: ServicesDetailInput!) {
  getServiceDetails(input: $input) {
    _id
    mainCategory
    subCategory
    serviceName
    subService
    subService2
    for
    description
    estimatedTime
    price
    inputTrackLimit
    uploadFileFormat
    deliveryFileFormat
    deliveryDays
    maxFileDuration
    numberOfReferenceFileUploads
    setOfRevisions
    revisionsDelivery
    mixVocalTuning
    mixProcessingReverbs
    mixProcessingDelays
    mixProcessingOtherFx
    addOn {
      type
      value
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetServiceDetailsQuery__
 *
 * To run a query within a React component, call `useGetServiceDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetServiceDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetServiceDetailsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetServiceDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetServiceDetailsQuery, GetServiceDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetServiceDetailsQuery, GetServiceDetailsQueryVariables>(GetServiceDetailsDocument, options);
      }
export function useGetServiceDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetServiceDetailsQuery, GetServiceDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetServiceDetailsQuery, GetServiceDetailsQueryVariables>(GetServiceDetailsDocument, options);
        }
export type GetServiceDetailsQueryHookResult = ReturnType<typeof useGetServiceDetailsQuery>;
export type GetServiceDetailsLazyQueryHookResult = ReturnType<typeof useGetServiceDetailsLazyQuery>;
export type GetServiceDetailsQueryResult = Apollo.QueryResult<GetServiceDetailsQuery, GetServiceDetailsQueryVariables>;
export const LoginDocument = gql`
    query Login($password: String!, $email: String!, $token: String) {
  login(password: $password, email: $email, token: $token)
}
    `;

/**
 * __useLoginQuery__
 *
 * To run a query within a React component, call `useLoginQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginQuery({
 *   variables: {
 *      password: // value for 'password'
 *      email: // value for 'email'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useLoginQuery(baseOptions: Apollo.QueryHookOptions<LoginQuery, LoginQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
      }
export function useLoginLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoginQuery, LoginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
        }
export type LoginQueryHookResult = ReturnType<typeof useLoginQuery>;
export type LoginLazyQueryHookResult = ReturnType<typeof useLoginLazyQuery>;
export type LoginQueryResult = Apollo.QueryResult<LoginQuery, LoginQueryVariables>;
export const RegisterDocument = gql`
    query Register($password: String!, $email: String!, $number: String!, $name: String!, $token: String) {
  register(
    password: $password
    email: $email
    number: $number
    name: $name
    token: $token
  )
}
    `;

/**
 * __useRegisterQuery__
 *
 * To run a query within a React component, call `useRegisterQuery` and pass it any options that fit your needs.
 * When your component renders, `useRegisterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRegisterQuery({
 *   variables: {
 *      password: // value for 'password'
 *      email: // value for 'email'
 *      number: // value for 'number'
 *      name: // value for 'name'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useRegisterQuery(baseOptions: Apollo.QueryHookOptions<RegisterQuery, RegisterQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RegisterQuery, RegisterQueryVariables>(RegisterDocument, options);
      }
export function useRegisterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RegisterQuery, RegisterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RegisterQuery, RegisterQueryVariables>(RegisterDocument, options);
        }
export type RegisterQueryHookResult = ReturnType<typeof useRegisterQuery>;
export type RegisterLazyQueryHookResult = ReturnType<typeof useRegisterLazyQuery>;
export type RegisterQueryResult = Apollo.QueryResult<RegisterQuery, RegisterQueryVariables>;
export const CompleteAccountDocument = gql`
    query CompleteAccount($password: String!, $email: String!, $number: String!, $name: String!, $token: String!) {
  completeAccount(
    password: $password
    email: $email
    number: $number
    name: $name
    token: $token
  )
}
    `;

/**
 * __useCompleteAccountQuery__
 *
 * To run a query within a React component, call `useCompleteAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompleteAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompleteAccountQuery({
 *   variables: {
 *      password: // value for 'password'
 *      email: // value for 'email'
 *      number: // value for 'number'
 *      name: // value for 'name'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useCompleteAccountQuery(baseOptions: Apollo.QueryHookOptions<CompleteAccountQuery, CompleteAccountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CompleteAccountQuery, CompleteAccountQueryVariables>(CompleteAccountDocument, options);
      }
export function useCompleteAccountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CompleteAccountQuery, CompleteAccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CompleteAccountQuery, CompleteAccountQueryVariables>(CompleteAccountDocument, options);
        }
export type CompleteAccountQueryHookResult = ReturnType<typeof useCompleteAccountQuery>;
export type CompleteAccountLazyQueryHookResult = ReturnType<typeof useCompleteAccountLazyQuery>;
export type CompleteAccountQueryResult = Apollo.QueryResult<CompleteAccountQuery, CompleteAccountQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    _id
    name
    email
    number
    services {
      ...userServices
    }
    lastLoggedIn
    lastLoggedOut
    accountVerified
    createdAt
    updatedAt
  }
}
    ${UserServicesFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const LogoutDocument = gql`
    query Logout {
  logout
}
    `;

/**
 * __useLogoutQuery__
 *
 * To run a query within a React component, call `useLogoutQuery` and pass it any options that fit your needs.
 * When your component renders, `useLogoutQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLogoutQuery({
 *   variables: {
 *   },
 * });
 */
export function useLogoutQuery(baseOptions?: Apollo.QueryHookOptions<LogoutQuery, LogoutQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LogoutQuery, LogoutQueryVariables>(LogoutDocument, options);
      }
export function useLogoutLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LogoutQuery, LogoutQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LogoutQuery, LogoutQueryVariables>(LogoutDocument, options);
        }
export type LogoutQueryHookResult = ReturnType<typeof useLogoutQuery>;
export type LogoutLazyQueryHookResult = ReturnType<typeof useLogoutLazyQuery>;
export type LogoutQueryResult = Apollo.QueryResult<LogoutQuery, LogoutQueryVariables>;
export const InitiatePaymentDocument = gql`
    query InitiatePayment($service: UserServicesInput!, $email: String) {
  initiatePayment(service: $service, email: $email)
}
    `;

/**
 * __useInitiatePaymentQuery__
 *
 * To run a query within a React component, call `useInitiatePaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useInitiatePaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInitiatePaymentQuery({
 *   variables: {
 *      service: // value for 'service'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useInitiatePaymentQuery(baseOptions: Apollo.QueryHookOptions<InitiatePaymentQuery, InitiatePaymentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InitiatePaymentQuery, InitiatePaymentQueryVariables>(InitiatePaymentDocument, options);
      }
export function useInitiatePaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InitiatePaymentQuery, InitiatePaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InitiatePaymentQuery, InitiatePaymentQueryVariables>(InitiatePaymentDocument, options);
        }
export type InitiatePaymentQueryHookResult = ReturnType<typeof useInitiatePaymentQuery>;
export type InitiatePaymentLazyQueryHookResult = ReturnType<typeof useInitiatePaymentLazyQuery>;
export type InitiatePaymentQueryResult = Apollo.QueryResult<InitiatePaymentQuery, InitiatePaymentQueryVariables>;
export const UpdatePorjectNameDocument = gql`
    query UpdatePorjectName($serviceId: String!, $projectName: String!) {
  updatePorjectName(serviceId: $serviceId, projectName: $projectName)
}
    `;

/**
 * __useUpdatePorjectNameQuery__
 *
 * To run a query within a React component, call `useUpdatePorjectNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpdatePorjectNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpdatePorjectNameQuery({
 *   variables: {
 *      serviceId: // value for 'serviceId'
 *      projectName: // value for 'projectName'
 *   },
 * });
 */
export function useUpdatePorjectNameQuery(baseOptions: Apollo.QueryHookOptions<UpdatePorjectNameQuery, UpdatePorjectNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UpdatePorjectNameQuery, UpdatePorjectNameQueryVariables>(UpdatePorjectNameDocument, options);
      }
export function useUpdatePorjectNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UpdatePorjectNameQuery, UpdatePorjectNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UpdatePorjectNameQuery, UpdatePorjectNameQueryVariables>(UpdatePorjectNameDocument, options);
        }
export type UpdatePorjectNameQueryHookResult = ReturnType<typeof useUpdatePorjectNameQuery>;
export type UpdatePorjectNameLazyQueryHookResult = ReturnType<typeof useUpdatePorjectNameLazyQuery>;
export type UpdatePorjectNameQueryResult = Apollo.QueryResult<UpdatePorjectNameQuery, UpdatePorjectNameQueryVariables>;
export const GetUserServiceDetailsByIdDocument = gql`
    query GetUserServiceDetailsById($serviceId: String!) {
  getUserServiceDetailsById(serviceId: $serviceId) {
    ...userServices
  }
}
    ${UserServicesFragmentDoc}`;

/**
 * __useGetUserServiceDetailsByIdQuery__
 *
 * To run a query within a React component, call `useGetUserServiceDetailsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserServiceDetailsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserServiceDetailsByIdQuery({
 *   variables: {
 *      serviceId: // value for 'serviceId'
 *   },
 * });
 */
export function useGetUserServiceDetailsByIdQuery(baseOptions: Apollo.QueryHookOptions<GetUserServiceDetailsByIdQuery, GetUserServiceDetailsByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserServiceDetailsByIdQuery, GetUserServiceDetailsByIdQueryVariables>(GetUserServiceDetailsByIdDocument, options);
      }
export function useGetUserServiceDetailsByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserServiceDetailsByIdQuery, GetUserServiceDetailsByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserServiceDetailsByIdQuery, GetUserServiceDetailsByIdQueryVariables>(GetUserServiceDetailsByIdDocument, options);
        }
export type GetUserServiceDetailsByIdQueryHookResult = ReturnType<typeof useGetUserServiceDetailsByIdQuery>;
export type GetUserServiceDetailsByIdLazyQueryHookResult = ReturnType<typeof useGetUserServiceDetailsByIdLazyQuery>;
export type GetUserServiceDetailsByIdQueryResult = Apollo.QueryResult<GetUserServiceDetailsByIdQuery, GetUserServiceDetailsByIdQueryVariables>;
export const VerifyUserDocument = gql`
    query VerifyUser($token: String!) {
  verifyUser(token: $token)
}
    `;

/**
 * __useVerifyUserQuery__
 *
 * To run a query within a React component, call `useVerifyUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useVerifyUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVerifyUserQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyUserQuery(baseOptions: Apollo.QueryHookOptions<VerifyUserQuery, VerifyUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VerifyUserQuery, VerifyUserQueryVariables>(VerifyUserDocument, options);
      }
export function useVerifyUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VerifyUserQuery, VerifyUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VerifyUserQuery, VerifyUserQueryVariables>(VerifyUserDocument, options);
        }
export type VerifyUserQueryHookResult = ReturnType<typeof useVerifyUserQuery>;
export type VerifyUserLazyQueryHookResult = ReturnType<typeof useVerifyUserLazyQuery>;
export type VerifyUserQueryResult = Apollo.QueryResult<VerifyUserQuery, VerifyUserQueryVariables>;
export const GetS3SignedUrlDocument = gql`
    query GetS3SignedURL {
  getS3SignedURL
}
    `;

/**
 * __useGetS3SignedUrlQuery__
 *
 * To run a query within a React component, call `useGetS3SignedUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetS3SignedUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetS3SignedUrlQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetS3SignedUrlQuery(baseOptions?: Apollo.QueryHookOptions<GetS3SignedUrlQuery, GetS3SignedUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetS3SignedUrlQuery, GetS3SignedUrlQueryVariables>(GetS3SignedUrlDocument, options);
      }
export function useGetS3SignedUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetS3SignedUrlQuery, GetS3SignedUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetS3SignedUrlQuery, GetS3SignedUrlQueryVariables>(GetS3SignedUrlDocument, options);
        }
export type GetS3SignedUrlQueryHookResult = ReturnType<typeof useGetS3SignedUrlQuery>;
export type GetS3SignedUrlLazyQueryHookResult = ReturnType<typeof useGetS3SignedUrlLazyQuery>;
export type GetS3SignedUrlQueryResult = Apollo.QueryResult<GetS3SignedUrlQuery, GetS3SignedUrlQueryVariables>;