import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';

export default function HubDistrictMaster() {
  const [hubs, setHubs] = useState([]);
  const [newHub, setNewHub] = useState({ hub_id: '', hub_name: '' });
  const [newDistrict, setNewDistrict] = useState({ district_code: '', district_name: '', hub_id: '' });
  const [loading, setLoading] = useState(false);

  const fetchHubs = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/hubs-districts');
      setHubs(res.data);
    } catch (err) {
      console.error('Failed to fetch hubs:', err);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  const handleAddHub = async () => {
    if (!newHub.hub_id || !newHub.hub_name) return alert("Please fill all hub fields");
    try {
      setLoading(true);
      await axios.post('http://localhost:3000/api/hub', newHub);
      setNewHub({ hub_id: '', hub_name: '' });
      fetchHubs();
    } catch (err) {
      console.error('Add hub failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDistrict = async () => {
    if (!newDistrict.district_code || !newDistrict.district_name || !newDistrict.hub_id)
      return alert("Please fill all district fields");
    try {
      setLoading(true);
      await axios.post('http://localhost:3000/api/district', newDistrict);
      setNewDistrict({ district_code: '', district_name: '', hub_id: '' });
      fetchHubs();
    } catch (err) {
      console.error('Add district failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, display: 'grid', gap: 32 }}>
      <Card>
        <CardContent>
          <Typography variant="h6">Add Hub</Typography>
          <TextField
            label="Hub ID"
            fullWidth
            margin="normal"
            value={newHub.hub_id}
            onChange={e => setNewHub({ ...newHub, hub_id: e.target.value })}
          />
          <TextField
            label="Hub Name"
            fullWidth
            margin="normal"
            value={newHub.hub_name}
            onChange={e => setNewHub({ ...newHub, hub_name: e.target.value })}
          />
          <Button variant="contained" onClick={handleAddHub} disabled={loading}>
            Add Hub
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Add District</Typography>
          <TextField
            label="District Code"
            fullWidth
            margin="normal"
            value={newDistrict.district_code}
            onChange={e => setNewDistrict({ ...newDistrict, district_code: e.target.value })}
          />
          <TextField
            label="District Name"
            fullWidth
            margin="normal"
            value={newDistrict.district_name}
            onChange={e => setNewDistrict({ ...newDistrict, district_name: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Hub</InputLabel>
            <Select
              value={newDistrict.hub_id}
              onChange={e => setNewDistrict({ ...newDistrict, hub_id: e.target.value })}
              label="Hub"
            >
              {hubs.map(hub => (
                <MenuItem key={hub.hub_id} value={hub.hub_id}>
                  {hub.hub_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAddDistrict} disabled={loading}>
            Add District
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Hubs and Districts
          </Typography>
          {hubs.map(hub => (
            <div key={hub.hub_id} style={{ marginBottom: 24 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {hub.hub_name} ({hub.hub_id})
              </Typography>
              <ul>
                {hub.districts?.map(d => (
                  <li key={d.district_code}>
                    {d.district_name} ({d.district_code})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
