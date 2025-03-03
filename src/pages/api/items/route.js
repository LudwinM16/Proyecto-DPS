import { NextResponse } from 'next/server';

const items = [
  { id: 1, nombre: 'Item 1', descripcion: 'Descripción del Item 1' },
  { id: 2, nombre: 'Item 2' },
];

export async function GET() {
  return NextResponse.json({ items });
}

export async function POST(request) {
  const { nombre, descripcion } = await request.json();
  if (!nombre) {
    return NextResponse.json({ error: 'El campo nombre es requerido' }, { status: 400 });
  }
  const newItem = { id: items.length + 1, nombre, descripcion };
  items.push(newItem);
  return NextResponse.json({ item: newItem }, { status: 201 });
}