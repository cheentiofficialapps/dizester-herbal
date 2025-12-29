'use client'

import { useEffect, useState } from 'react'
import { Medusa } from '@medusajs/js-sdk'

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ''
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

    if (!backendUrl) {
      setError('NEXT_PUBLIC_MEDUSA_BACKEND_URL is not set')
      setLoading(false)
      return
    }

    if (!publishableKey) {
      setError('NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set')
      setLoading(false)
      return
    }

    const medusa = new Medusa({
      baseUrl: backendUrl,
      publishableKey: publishableKey,
    })

    medusa.store.product
      .list()
      .then((response) => {
        setProducts(response.products || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching products:', err)
        setError(err.message || 'Failed to fetch products')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Loading...</h1>
      </main>
    )
  }

  if (error) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Error</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Make sure NEXT_PUBLIC_MEDUSA_BACKEND_URL and NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY are set correctly.
        </p>
      </main>
    )
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Medusa Store</h1>
      
      {products.length === 0 ? (
        <div>
          <p>No products found.</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Run the seed script to add sample products.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
              }}
            >
              <h2 style={{ marginBottom: '0.5rem' }}>{product.title}</h2>
              {product.description && (
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {product.description}
                </p>
              )}
              {product.variants && product.variants.length > 0 && (
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
                  ${(product.variants[0].prices?.[0]?.amount || 0) / 100}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

