/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '*arn:aws:s3:::chihuahuenos-docs-nava', 
            port: '',
            pathname: '/**',
          },
        ],
    }
}

module.exports = nextConfig
