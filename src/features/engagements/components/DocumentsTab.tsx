import React, { useState } from 'react';

import FilesandDocuments from './FilesandDocuments';

export default function DocumentsTab({ engagement }: any) {
  return (
    <div>
      <FilesandDocuments engagement={engagement} />
    </div>
  );
}
