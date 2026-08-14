import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || !query.trim()) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  }

  const cleanQuery = query.trim();

  try {
    // Query Wikipedia REST API summary endpoint
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1)
    )}`;

    const wikiRes = await fetch(wikiUrl, {
      headers: {
        'User-Agent': 'VidyaEducationalApp/1.0 (educational research companion)',
      },
      next: { revalidate: 3600 },
    });

    if (wikiRes.ok) {
      const data = await wikiRes.json();
      if (data.originalimage?.source) {
        return NextResponse.json({
          url: data.originalimage.source,
          title: data.title || cleanQuery,
        });
      }
      if (data.thumbnail?.source) {
        return NextResponse.json({
          url: data.thumbnail.source,
          title: data.title || cleanQuery,
        });
      }
    }

    return NextResponse.json({ error: 'No image found' }, { status: 404 });
  } catch (error: unknown) {
    console.error('Image Route Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve image' }, { status: 500 });
  }
}
