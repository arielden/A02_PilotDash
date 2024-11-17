import pandas as pd
import sqlite3

# Function to connect to the database
def connect_db():
    return sqlite3.connect('dbGFE12.sqlite3')

# Function to close the database connection
def close_connection(connection):
    connection.close()
    print("Database connection closed.")

# Function to load suppliers
def load_suppliers(df, connection):
    cursor = connection.cursor()
    
    df['Supplier'] = df['Supplier'].str.strip()  # Clean up any white spaces
    suppliers = df['Supplier'].dropna().unique()  # Get unique suppliers
    for supplier in suppliers:
        cursor.execute('''
            INSERT OR IGNORE INTO api_poeassy_supplier (supplier_name) 
            VALUES (?)
        ''', (supplier,))
    connection.commit()
    print("Suppliers loaded successfully.")

# Function to load assemblies
def load_assemblies(df, connection):
    cursor = connection.cursor()

    for idx, row in df.iterrows():
        # Process only rows where the Type is 'SET'
        if row['Type'] == 'SET':
            # Get eng_type_id based on the 'Type' column
            type_name = row['Type']
            cursor.execute('SELECT id FROM api_poeassy_engtype WHERE name = ?', (type_name,))
            type_row = cursor.fetchone()
            eng_type_id = type_row[0] if type_row else None

            # Insert the main assembly with supplier_id, assembly_name, part_number, indice, version, and eng_type_id
            cursor.execute('''
                INSERT INTO api_poeassy_assembly (supplier_id, assembly_name, part_number, indice, version, eng_type_id) 
                VALUES (
                    (SELECT id FROM api_poeassy_supplier WHERE supplier_name = ?),
                    ?, ?, ?, ?, ?
                )
            ''', (row['Supplier'], row['Assembly'], row['PartNumber'], row['Indice'], row['Version'], eng_type_id))

    connection.commit()
    print("Main assemblies loaded successfully.")

def load_subassemblies(df, connection):
    cursor = connection.cursor()

    for idx, row in df.iterrows():
        # Process only rows where the Type is 'ASSY'
        if row['Type'] == 'ASSY':
            # Get eng_type_id based on the 'Type' column
            type_name = row['Type']
            cursor.execute('SELECT id FROM api_poeassy_engtype WHERE name = ?', (type_name,))
            type_row = cursor.fetchone()
            eng_type_id = type_row[0] if type_row else None

            # Insert the subassembly into the `api_poeassy_assembly` table
            cursor.execute('''
                INSERT INTO api_poeassy_assembly (supplier_id, assembly_name, part_number, indice, version, eng_type_id) 
                VALUES (
                    (SELECT id FROM api_poeassy_supplier WHERE supplier_name = ?),
                    ?, ?, ?, ?, ?
                )
            ''', (row['Supplier'], row['Designation'], row['PartNumber'], row['Indice'], row['Version'], eng_type_id))

            # Retrieve the ID of the recently inserted subassembly
            cursor.execute('SELECT last_insert_rowid()')
            sub_assembly_id = cursor.fetchone()[0]

            # Retrieve the parent assembly ID based on the part_number in the 'Parent' column
            parent_part_number = row['Parent'] if pd.notna(row['Parent']) else None
            if parent_part_number:
                cursor.execute('SELECT id FROM api_poeassy_assembly WHERE part_number = ?', (parent_part_number,))
                parent_row = cursor.fetchone()
                parent_assembly_id = parent_row[0] if parent_row else None

                # Insert the relationship into `AssemblySubAssembly` if parent_assembly_id is found
                if parent_assembly_id:
                    coef = int(row['Coef']) if pd.notna(row['Coef']) else 1  # Use coefficient if available
                    cursor.execute('''
                        INSERT INTO api_poeassy_assemblysubassembly (parent_assembly_id, sub_assembly_id, coef)
                        VALUES (?, ?, ?)
                    ''', (parent_assembly_id, sub_assembly_id, coef))

    connection.commit()
    print("Subassemblies loaded successfully.")


# Function to load properties (material and protection)
def load_properties(df, connection):
    cursor = connection.cursor()
    
    for _, row in df.iterrows():
        # Clean up white spaces from material and protection
        material = row['Material'].strip() if pd.notna(row['Material']) else None
        protection = row['Protection'].strip() if pd.notna(row['Protection']) else None

        if material and protection:  # Ensure both values are present
            # Check if the combination of material and protection already exists
            cursor.execute('''
                SELECT id FROM api_poeassy_property
                WHERE material = ? AND protection = ?
            ''', (material, protection))
            
            property_row = cursor.fetchone()
            
            # If it doesn't exist, insert the combination of material and protection
            if property_row is None:
                cursor.execute('''
                    INSERT INTO api_poeassy_property (material, protection) 
                    VALUES (?, ?)
                ''', (material, protection))
    
    connection.commit()  # Commit all changes at once
    print("Properties loaded successfully.")

# Function to load parts
def load_parts(df, connection):
    cursor = connection.cursor()

    for _, row in df.iterrows():
        # Check if the row has "EMB" in the "Type" column
        if row['Type'] == 'EMB':
            material = row['Material'] if pd.notna(row['Material']) else None
            protection = row['Protection'] if pd.notna(row['Protection']) else None
            parent_name = row['Parent'] if pd.notna(row['Parent']) else None

            # Get the property_id based on material and protection
            cursor.execute('''
                SELECT id FROM api_poeassy_property WHERE material = ? AND protection = ?
            ''', (material, protection))
            property_row = cursor.fetchone()
            property_id = property_row[0] if property_row else None

            # Get the condition_id based on condition
            cursor.execute('''
                SELECT id FROM api_poeassy_condition WHERE name = ?
            ''', (row['Condition'],))
            condition_row = cursor.fetchone()
            condition_id = condition_row[0] if condition_row else None

            # Get the parent_id based on the Parent column
            cursor.execute('''
                SELECT id FROM api_poeassy_assembly WHERE assembly_name = ?
            ''', (parent_name,))  # Using Parent column instead of the hierarchy level logic
            parent_row = cursor.fetchone()
            parent_id = parent_row[0] if parent_row else None

            # Insert into parts table with the parent_id and other fields
            cursor.execute('''
                INSERT INTO api_poeassy_part (supplier_id, part_number, indice, version, designation, thickness, mass, condition_id, part_property_id) 
                VALUES (
                    (SELECT id FROM api_poeassy_supplier WHERE supplier_name = ?),
                    ?, ?, ?, ?, ?, ?, ?, ?
                )
            ''', (row['Supplier'], row['PartNumber'], row['Indice'], row['Version'], row['Designation'], row['Thickness'], row['Mass'], condition_id, property_id))

    connection.commit()
    print("Parts loaded successfully.")

# Function to load RMU rows based on the "Type" column, avoiding duplicates
def load_rmu(df, connection):
    cursor = connection.cursor()
    
    for _, row in df.iterrows():
        # Check if the row has "RMU" in the "Type" column
        if row['Type'] == 'RMU':
            designation = row['Designation'].strip() if pd.notna(row['Designation']) else None
            part_number = row['PartNumber'].strip() if pd.notna(row['PartNumber']) else None
            mass = row['Mass'] if pd.notna(row['Mass']) else None
            
            if designation:
                # Insert the row into api_poeassy_rmu, ignore if already exists
                cursor.execute('''
                    INSERT OR IGNORE INTO api_poeassy_rmu (part_number, designation, mass)
                    VALUES (?, ?, ?)
                ''', (part_number, designation, mass))
    
    connection.commit()
    print("RMU data loaded successfully.")

# Function to load assembly_rmu (junction table for assemblies and RMU)
def load_assembly_rmu(df, connection):
    cursor = connection.cursor()
    
    for _, row in df.iterrows():
        if row['Type'] == 'RMU':
            # Use the 'Parent' column (now contains PartNumber) without strip()
            parent_part_number = row['Parent'] if pd.notna(row['Parent']) else None
            coef = int(row['Coef']) if pd.notna(row['Coef']) else 1 
            
            # Get the assembly_id based on the 'Parent' PartNumber
            cursor.execute('SELECT id FROM api_poeassy_assembly WHERE part_number = ?', (parent_part_number,))
            assembly_row = cursor.fetchone()
            assembly_id = assembly_row[0] if assembly_row else None

            # Get the rmu_id based on the designation
            cursor.execute('SELECT id FROM api_poeassy_rmu WHERE designation = ?', (row['Designation'],))
            rmu_row = cursor.fetchone()
            rmu_id = rmu_row[0] if rmu_row else None

            # Insert into the junction table assembly_rmu
            if assembly_id and rmu_id:
                cursor.execute('''
                    INSERT INTO api_poeassy_assemblyrmu (assembly_id, rmu_id, coef)
                    VALUES (?, ?, ?)
                ''', (assembly_id, rmu_id, coef))

    connection.commit()
    print("Assembly RMU loaded successfully.")

# Function to load assembly_parts (junction table for assemblies and parts)
def load_assembly_parts(df, connection):
    cursor = connection.cursor()
    
    for _, row in df.iterrows():
        if row['Type'] == 'EMB':  # Ensure we only process parts with type "EMB"
            # Use the 'Parent' column (now contains PartNumber) without strip()
            parent_part_number = row['Parent'] if pd.notna(row['Parent']) else None
            coef = int(row['Coef']) if pd.notna(row['Coef']) else 1

            # Get the assembly_id based on the Parent PartNumber
            cursor.execute('''
                SELECT id FROM api_poeassy_assembly WHERE part_number = ?
            ''', (parent_part_number,))
            assembly_row = cursor.fetchone()
            assembly_id = assembly_row[0] if assembly_row else None

            # Get the part_id based on the part_number
            cursor.execute('''
                SELECT id FROM api_poeassy_part WHERE part_number = ?
            ''', (row['PartNumber'],))
            part_row = cursor.fetchone()
            part_id = part_row[0] if part_row else None

            # Ensure both assembly_id and part_id are found before inserting
            if assembly_id and part_id:
                cursor.execute('''
                    INSERT INTO api_poeassy_assemblypart (assembly_id, part_id, coef)
                    VALUES (?, ?, ?)
                ''', (assembly_id, part_id, coef))

    connection.commit()
    print("Assembly parts loaded successfully.")

# Function to load types
def load_types(df, connection):
    cursor = connection.cursor()
    
    df['Type'] = df['Type'].str.strip()  # Clean up any white spaces
    types = df['Type'].dropna().unique()  # Get unique types
    for t in types:
        cursor.execute('''
            INSERT OR IGNORE INTO api_poeassy_engtype (name) 
            VALUES (?)
        ''', (t,))
    
    connection.commit()
    print("Types loaded successfully.")

# Function to load conditions
def load_conditions(df, connection):
    cursor = connection.cursor()
    
    df['Condition'] = df['Condition'].str.strip()  # Clean up any white spaces
    conditions = df['Condition'].dropna().unique()  # Get unique conditions
    for condition in conditions:
        cursor.execute('''
            INSERT OR IGNORE INTO api_poeassy_condition (name) 
            VALUES (?)
        ''', (condition,))
    
    connection.commit()
    print("Conditions loaded successfully.")

# Read the Excel file
#excel_path = '/W2441_Tableau_v01.xlsm'
excel_path = './W2441_Tableau_TEST.xlsm'
df = pd.read_excel(excel_path, sheet_name='tableau_gfe12', engine='openpyxl', header=0)

# Connect to the database
connection = connect_db()

# Call each function to insert data into the database
load_suppliers(df, connection)
load_properties(df, connection)
load_conditions(df, connection)
load_types(df, connection)
load_assemblies(df, connection)
load_subassemblies(df, connection)
load_parts(df, connection)
load_rmu(df, connection)
load_assembly_rmu(df, connection)
load_assembly_parts(df, connection)

# Close the database connection
close_connection(connection)
