import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  const { path: filePath, content, title, isPublic, slug, version } = await request.json();

  if (!filePath || title === undefined || isPublic === undefined || slug === undefined) {
    return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const metaFilePath = path.join(process.cwd(), 'app', 'docs', 'meta.json');
    const metaContent = await fs.readFile(metaFilePath, 'utf8');
    const metaData = JSON.parse(metaContent);

    // Normalize the incoming file path to remove any 'app/docs/' prefix
    const normalizedFilePath = filePath.replace(/^(app\/docs\/)?/, '');
    console.log('Normalized file path:', normalizedFilePath); // Debug log

    const updateInStructure = async (items) => {
      for (let item of items) {
        // Normalize the item path for comparison
        const normalizedItemPath = item.path.replace(/^(app\/docs\/)?/, '');
        console.log('Comparing paths:', { 
          normalizedFilePath, 
          normalizedItemPath, 
          match: normalizedItemPath === normalizedFilePath 
        }); // Debug log

        if (normalizedItemPath === normalizedFilePath) {
          console.log('Found matching item:', item); // Debug log
          item.title = title;
          item.isPublic = isPublic;
          item.slug = slug;
          item.lastModified = new Date().toISOString();
          item.version = version || item.version || 1;
          
          // Update file content - ensure we save in app/docs directory
          const fullPath = path.join(process.cwd(), 'app', 'docs', normalizedFilePath);
          console.log('Writing file to:', fullPath); // Debug log
          await fs.writeFile(fullPath, content, 'utf8');

          return true;
        }
        if (item.children && item.children.length > 0) {
          if (await updateInStructure(item.children)) {
            return true;
          }
        }
      }
      return false;
    };

    if (!await updateInStructure(metaData.pages)) {
      console.log('No existing entry found, creating new one'); // Debug log
      // If the file doesn't exist in the structure, add it as a new page
      metaData.pages.push({
        slug,
        title,
        path: normalizedFilePath,
        isPublic,
        version: version || 1,
        lastModified: new Date().toISOString(),
        children: []
      });

      // Create the new file - ensure we save in app/docs directory
      const fullPath = path.join(process.cwd(), 'app', 'docs', normalizedFilePath);
      console.log('Creating new file at:', fullPath); // Debug log
      
      // Ensure directory exists
      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });
      
      // Write content with explicit encoding
      await fs.writeFile(fullPath, content, 'utf8');
    }

    // Write updated meta data
    await fs.writeFile(metaFilePath, JSON.stringify(metaData, null, 2), 'utf8');

    return new Response(JSON.stringify({ message: 'File updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating file:', error);
    return new Response(JSON.stringify({ error: `Failed to update file: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
