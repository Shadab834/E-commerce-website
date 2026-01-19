const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // 1. Fetch real product data from DummyJSON
    const response = await fetch('https://dummyjson.com/products?limit=50')
    const data = await response.json()
    const products = data.products

    console.log(`Fetched ${products.length} products to seed.`)

    // 2. Clear existing data (optional, but good for idempotency)
    try {
        await prisma.review.deleteMany()
        await prisma.orderItem.deleteMany()
        await prisma.product.deleteMany()
    } catch (e) {
        console.log("Database was already empty or tables missing.")
    }

    // 3. Insert Products
    for (const p of products) {
        const product = await prisma.product.create({
            data: {
                title: p.title,
                description: p.description,
                price: p.price,
                stockQuantity: p.stock,
                category: p.category,
                images: JSON.stringify(p.images), // Store detailed images as JSON string
                rating: p.rating,
                isFeatured: p.rating > 4.5,
            },
        })
        console.log(`Created product with id: ${product.id}`)
    }

    // 4. Create an Admin User if not exists
    const adminEmail = 'admin@shopzone.com'
    // Hash for 'password123'
    const passwordHash = '$2a$10$wKqQn8Z7.u6h.h8s8o/o.u.x.x.x.x' // Placeholder hash, in real app use bcrypt in script
    // Note: For simplicity in this seed script we skip real hashing import to avoid dependency issues if not installed in root,
    // but we should assume the user will register properly. 
    // We can create a basic admin though.

    // Actually, let's skip user creation in seed to avoid conflict with bcryptjs import if it fails in plain JS.
    // The user can register manually.

    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
