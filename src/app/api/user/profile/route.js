// app/api/user/profile/route.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { dbConnect, collectionNamesObj } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Validate session user
    if (!session.user?.email) {
      return new Response(JSON.stringify({ error: 'User email not found in session' }), {
        status: 400,
      });
    }

    const usersCollection = await dbConnect(collectionNamesObj.userCollection);
    const data = await request.json();

    // Validate required fields
    if (!data.name || data.name.trim() === '') {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
      });
    }

    // Find user by email (works for both credential and social users)
    let user;
    if (session.user.id) {
      try {
        // Try MongoDB ObjectId first (for credential users)
        const userId = new ObjectId(session.user.id);
        user = await usersCollection.findOne({ _id: userId });
      } catch (error) {
        // If ObjectId fails, try finding by email (for social login users)
        console.log('ObjectId conversion failed, trying email lookup for social login user');
        user = await usersCollection.findOne({ email: session.user.email });
      }
    } else {
      // Fallback to email lookup for social login users without ID
      user = await usersCollection.findOne({ email: session.user.email });
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // Prepare update data - only include fields that have values
    const updateData = {
      name: data.name.trim(),
      updatedAt: new Date(),
    };

    // Optional fields - only add if they exist
    const optionalFields = [
      'image', 'phone', 'bio', 'favoriteInstruments', 'favoriteGenres',
      'skillLevel', 'yearsOfExperience', 'practiceFrequency', 'musicalGoals',
      'influences', 'youtubeUrl', 'spotifyUrl', 'soundcloudUrl'
    ];

    optionalFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
        if (field === 'yearsOfExperience') {
          updateData[field] = parseInt(data[field]) || 0;
        } else if (field === 'favoriteInstruments' || field === 'favoriteGenres') {
          // Ensure arrays are properly formatted
          updateData[field] = Array.isArray(data[field]) ? data[field] : [];
        } else {
          updateData[field] = data[field];
        }
      }
    });

    // Update user using their _id from the found user
    const result = await usersCollection.findOneAndUpdate(
      { _id: user._id },
      { 
        $set: updateData
      },
      { 
        returnDocument: 'after'
      }
    );

    if (!result) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = result;

    return new Response(JSON.stringify({ 
      message: 'Profile updated successfully',
      user: userWithoutPassword
    }), {
      status: 200,
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Validate session user
    if (!session.user?.email) {
      return new Response(JSON.stringify({ error: 'User email not found in session' }), {
        status: 400,
      });
    }

    const usersCollection = await dbConnect(collectionNamesObj.userCollection);
    
    let user;
    
    // Handle different user ID types (MongoDB ObjectId vs social login IDs)
    if (session.user.id) {
      try {
        // Try MongoDB ObjectId first (for credential users)
        const userId = new ObjectId(session.user.id);
        user = await usersCollection.findOne({ _id: userId });
      } catch (error) {
        // If ObjectId fails, try finding by email (for social login users)
        console.log('ObjectId conversion failed, trying email lookup for social login user');
        user = await usersCollection.findOne({ email: session.user.email });
      }
    } else {
      // Fallback to email lookup for social login users without ID
      user = await usersCollection.findOne({ email: session.user.email });
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    // Remove password from response
    const { password, ...userResponse } = user;
    
    // Ensure all music fields exist with default values
    const userWithDefaults = {
      id: userResponse._id?.toString() || session.user.id,
      name: userResponse.name || session.user.name || '',
      email: userResponse.email || session.user.email || '',
      image: userResponse.image || session.user.image || '',
      phone: userResponse.phone || '',
      bio: userResponse.bio || '',
      favoriteInstruments: userResponse.favoriteInstruments || [],
      favoriteGenres: userResponse.favoriteGenres || [],
      skillLevel: userResponse.skillLevel || '',
      yearsOfExperience: userResponse.yearsOfExperience || 0,
      practiceFrequency: userResponse.practiceFrequency || '',
      musicalGoals: userResponse.musicalGoals || '',
      influences: userResponse.influences || '',
      youtubeUrl: userResponse.youtubeUrl || '',
      spotifyUrl: userResponse.spotifyUrl || '',
      soundcloudUrl: userResponse.soundcloudUrl || '',
      role: userResponse.role || 'user',
      createdAt: userResponse.createdAt,
      updatedAt: userResponse.updatedAt
    };

    return new Response(JSON.stringify({ user: userWithDefaults }), {
      status: 200,
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}