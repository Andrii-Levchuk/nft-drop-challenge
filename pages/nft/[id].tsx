import React, { cloneElement, useEffect, useState } from 'react'
import {
	useAddress,
	useDisconnect,
	useMetamask,
	
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typing'
import Link from 'next/link'

interface Props {
	collection: Collection
}

function NFTDropPage({ collection }: Props) {


	// auth
	const connectWithMetamask = useMetamask()
	const address = useAddress()
	const disconnect = useDisconnect()

	

	//
	return (
		<div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>
			{/* {left} */}
			<div className='lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500'>
				<div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
					<div className='rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2'>
						<img
							className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
							src={urlFor(collection.mainImage).url()}
							alt='image'
						/>
					</div>
					<div className='text-center p-5 space-y-2'>
						<h1 className='text-4xl text-white font-bold'>
							{collection.NFTCollection}
						</h1>
						<h2 className='text-xl text-gray-300'>{collection.description}</h2>
					</div>
				</div>
			</div>

			{/* {right} */}
			<div className='flex flex-1 flex-col p-12 lg:col-span-6'>
				{/* Header */}
				<header className='flex items-center justify-between'>
					<Link href={'/'}>
						<h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'>
							The{' '}
							<span className='font-extrabold underline decoration-pink-600'>
								ALEVCHUK
							</span>{' '}
							NFT Marker Place
						</h1>
					</Link>
					<button
						onClick={() => (address ? disconnect() : connectWithMetamask())}
						className='rounded-full bg-gradient-to-br from-cyan-800 to-rose-500 px-4 py-2 text-xs text-white font-bold lg:px-5 lg:py-3 lg:text-base'
					>
						{address ? 'Sign Out' : 'Sign In'}
					</button>
				</header>
				<hr className='my-2 border' />
				{address && (
					<p className='text-center text-sm text-pink-600 '>
						You're logged in with wallet {address.substring(0, 5)}...
						{address.substring(address.length - 5)}
					</p>
				)}

				{/* Content */}
				<div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0 lg:justify-center'>
					<img
						className=''
						src={urlFor(collection.previewImage).url()}
						alt='photo'
					/>

					<h1 className='text-3xl font-bold lg:tetx-5xl lg:font-extrabold'>
						{collection.title}
					</h1>
					<p className='pt-2 text-xl text-green-500 '>
						0 / 21 NFT's claimed
					</p>
				</div>
				{/* Mint Button */}
				<button disabled={!address} className='h-16 bg-gradient-to-br from-cyan-800 to-rose-500 w-full text-white rounded-full mt-10 font-bold disabled:bg-gray-400'>
					Mint NFT (0.01 ETH)
				</button>
			</div>
		</div>
	)
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const query = `*[_type == "collection" && slug.current == $id][0] {
  _id,
  title,
  address,
  description,
  NFTCollection,
  mainImage {
    asset
  },
  previewImage {
    asset
  },
  slug {
    current
  },
  creator-> {
    _id,
    name,
    address,
    slug {
      current
    },
  },
}`
	const collection = await sanityClient.fetch(query, { id: params?.id })

	if (!collection) {
		return {
			notFound: true,
		}
	}
	return {
		props: {
			collection,
		},
	}
}
