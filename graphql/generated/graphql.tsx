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
  getAllService: Array<Services>;
  getServiceDetails: Array<Services>;
  login: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  me: User;
  register: Scalars['Boolean'];
};


export type QueryAddUserServiceArgs = {
  input: UserServicesInput;
};


export type QueryGetServiceDetailsArgs = {
  input: ServicesDetailInput;
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
  name: Scalars['String'];
  number: Scalars['String'];
  services: Array<UserServices>;
  updatedAt: Scalars['DateTime'];
};

export type UserServices = {
  __typename?: 'UserServices';
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
  paid: Scalars['Boolean'];
  price: Scalars['Float'];
  projectName?: Maybe<Scalars['String']>;
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
  paid: Scalars['Boolean'];
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

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', _id: string, name: string, email: string, number: string, lastLoggedIn?: any | null, lastLoggedOut?: any | null, accountVerified: boolean, createdAt: any, updatedAt: any, services: Array<{ __typename?: 'UserServices', projectName?: string | null, _id: string, mainCategory: string, subCategory: string, serviceName: string, subService?: string | null, subService2?: string | null, for?: string | null, description?: string | null, estimatedTime?: number | null, price: number, inputTrackLimit?: number | null, uploadFileFormat: Array<string>, deliveryFileFormat: Array<string>, deliveryDays?: number | null, maxFileDuration?: number | null, numberOfReferenceFileUploads?: number | null, setOfRevisions?: number | null, revisionsDelivery?: number | null, mixVocalTuning?: string | null, mixProcessingReverbs?: string | null, mixProcessingDelays?: string | null, mixProcessingOtherFx?: string | null, paid: boolean, addOn: Array<{ __typename?: 'AddOn', type: string, value?: number | null }> }> } };

export type LogoutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutQuery = { __typename?: 'Query', logout: boolean };

export type AddUserServiceQueryVariables = Exact<{
  input: UserServicesInput;
}>;


export type AddUserServiceQuery = { __typename?: 'Query', addUserService: boolean };


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
export const MeDocument = gql`
    query Me {
  me {
    _id
    name
    email
    number
    services {
      projectName
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
      paid
    }
    lastLoggedIn
    lastLoggedOut
    accountVerified
    createdAt
    updatedAt
  }
}
    `;

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
export const AddUserServiceDocument = gql`
    query AddUserService($input: UserServicesInput!) {
  addUserService(input: $input)
}
    `;

/**
 * __useAddUserServiceQuery__
 *
 * To run a query within a React component, call `useAddUserServiceQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddUserServiceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddUserServiceQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddUserServiceQuery(baseOptions: Apollo.QueryHookOptions<AddUserServiceQuery, AddUserServiceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AddUserServiceQuery, AddUserServiceQueryVariables>(AddUserServiceDocument, options);
      }
export function useAddUserServiceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AddUserServiceQuery, AddUserServiceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AddUserServiceQuery, AddUserServiceQueryVariables>(AddUserServiceDocument, options);
        }
export type AddUserServiceQueryHookResult = ReturnType<typeof useAddUserServiceQuery>;
export type AddUserServiceLazyQueryHookResult = ReturnType<typeof useAddUserServiceLazyQuery>;
export type AddUserServiceQueryResult = Apollo.QueryResult<AddUserServiceQuery, AddUserServiceQueryVariables>;